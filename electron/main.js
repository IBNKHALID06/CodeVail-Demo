const { app, BrowserWindow, shell, clipboard, desktopCapturer, ipcMain, Menu } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const http = require('http');
const fs = require('fs');
const { fork } = require('child_process');

// Anti-cheat monitoring system
const antiCheatLogger = require('./anti-cheat-logger');

let mainWindow;
let devPort = null;              // Active Next.js dev port (detected)
let currentBaseUrl = null;       // Base URL currently loaded (http://localhost:<port> or file://...)
let devRelocationAttempted = false; // Prevent repeated relocation attempts
const BENIGN_PROCESSES = new Set(['chrome.exe','chrome','msedge.exe','msedge','edge','code','code.exe']);

// Lightweight log file per run (helps post‑mortem debugging)
const LOG_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOG_DIR)) {
  try { fs.mkdirSync(LOG_DIR, { recursive: true }); } catch {}
}
const LOG_FILE = path.join(LOG_DIR, `electron-${new Date().toISOString().replace(/[:.]/g,'-')}.log`);
function appendLog(level, args) {
  try {
    const line = `[${new Date().toISOString()}] [${level}] ${args.map(a => {
      if (typeof a === 'string') return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    }).join(' ')}\n`;
    fs.appendFileSync(LOG_FILE, line);
  } catch {}
}
['log','info','warn','error'].forEach(level => {
  const orig = console[level].bind(console);
  console[level] = (...args) => { appendLog(level.toUpperCase(), args); orig(...args); };
});
console.log('[Startup] Logging to', LOG_FILE);

// Optional runtime log filtering (production cleanliness)
const FILTER_NON_ANTICHEAT = (process.env.ANTI_CHEAT_LOG_FILTER || '0') === '1';
if (FILTER_NON_ANTICHEAT && !isDev) {
  const origLog = console.log.bind(console);
  console.log = (...args) => {
    try {
      const first = args[0];
      if (typeof first === 'string' && first.includes('[AntiCheat]')) {
        origLog(...args);
      }
    } catch {}
  };
  const origInfo = console.info.bind(console);
  console.info = (...args) => console.log(...args);
  const origWarn = console.warn.bind(console);
  console.warn = (...args) => {
    const first = args[0];
    if (typeof first === 'string' && first.includes('[AntiCheat]')) {
      origWarn(...args);
    }
  };
  const origError = console.error.bind(console);
  console.error = (...args) => origError(...args); // Always show errors
  console.log('[AntiCheat][LogFilter] Active (showing only AntiCheat logs + errors)');
}

let loadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 5;
// Test session lifecycle state & intervals
let testState = 'idle'; // idle | active | completed
let processCheckInterval = null;
let clipboardCheckInterval = null;
let terminationInProgress = false; // prevents duplicate termination flows
let firstScanAutoActivated = false; // (legacy) retained for compatibility but no longer used
let bootstrapScanInterval = null; // runs until monitoring starts or termination occurs
let monitoringInitialized = false; // ensure monitoring setup only once per app lifetime
let testGraceUntil = null; // timestamp until which termination is suppressed after start
let routeMonitorDelay = null; // timeout for delayed monitoring start based on route
let pendingRouteMonitoringStart = false; // flag if a test-route activation was requested before monitoring was initialized
let lastRouteProcessed = null; // last stable route that triggered logic
let routeDebounceTimer = null; // timer id for debounced route handling
const ROUTE_DEBOUNCE_MS = Number(process.env.ANTI_CHEAT_ROUTE_DEBOUNCE_MS || 300);
let antiCheatChild = null; // child process reference when in child mode
let lastHeartbeatTs = null;
const CHILD_MODE = (process.env.ANTI_CHEAT_MODE || 'inline') === 'child';
// Track when the last termination occurred so we can safely re-arm without waiting full 30s timeout
let lastTerminationAt = null;

function resetAntiCheatState() {
  try {
    if (processCheckInterval) { clearInterval(processCheckInterval); processCheckInterval = null; }
    if (clipboardCheckInterval) { clearInterval(clipboardCheckInterval); clipboardCheckInterval = null; }
  } catch {}
  testState = 'idle';
  terminationInProgress = false;
  firstScanAutoActivated = false;
  if (bootstrapScanInterval) { try { clearInterval(bootstrapScanInterval); } catch {} bootstrapScanInterval = null; }
  if (routeMonitorDelay) { try { clearTimeout(routeMonitorDelay); } catch {} routeMonitorDelay = null; }
}

// Interview session termination (NOT system process kill)
async function terminateInterviewSession(processes, eventData) {
  console.log(`[AntiCheat] TERMINATING INTERVIEW SESSION due to violations:`, processes);
  // Ensure background monitoring halts immediately to prevent duplicate redirects
  try { if (global.stopMonitoring) global.stopMonitoring(); } catch {}
  lastTerminationAt = Date.now();

  // Filter benign processes for display (keep full list for audit/logs)
  const filtered = (processes || []).filter(p => !BENIGN_PROCESSES.has(String(p).toLowerCase()));
  const displayList = filtered.length ? filtered : processes;

  antiCheatLogger.logEvent('INTERVIEW_TERMINATED', {
    reason: 'Critical security violations detected',
    violations: processes,
    filteredViolations: displayList,
    criticalViolations: eventData.criticalViolations || [],
    highSeverityViolations: eventData.highSeverityViolations || [],
    threatLevel: eventData.threatLevel,
    timestamp: new Date().toISOString(),
    terminationTriggered: true
  });

  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('interview-terminated', {
      reason: 'Critical security violations detected',
      violations: processes,
      filteredViolations: displayList,
      eventData: eventData,
      timestamp: new Date().toISOString()
    });

    // Persist details for termination page (both volatile global + durable localStorage)
    const terminationPayload = {
      violations: processes,
      filteredViolations: displayList,
      threatLevel: eventData.threatLevel || 'unknown',
      timestamp: new Date().toISOString()
    };
    try {
      mainWindow.webContents.executeJavaScript(`try { window.__lastAntiCheatTermination = ${JSON.stringify(terminationPayload)}; localStorage.setItem('lastAntiCheatTermination', JSON.stringify(window.__lastAntiCheatTermination)); } catch(e){ console.warn('Persist termination payload failed', e); }`);
    } catch(e) { console.warn('[AntiCheat] Failed to inject termination payload', e.message); }
  }

  // Derive termination page URL dynamically (works even if port changed)
  setTimeout(() => {
    if (mainWindow && mainWindow.webContents) {
      try {
        let targetUrl = null;
        // Append encoded data param so termination page can always retrieve even on first load
        const enc = encodeURIComponent(Buffer.from(JSON.stringify({ v: displayList, tl: eventData.threatLevel || 'unknown', ts: Date.now() })).toString('base64'));
        if (devPort) {
          targetUrl = `http://localhost:${devPort}/interview-terminated?data=${enc}`;
        } else if (currentBaseUrl && currentBaseUrl.startsWith('http')) {
          targetUrl = `${currentBaseUrl.replace(/\/$/, '')}/interview-terminated?data=${enc}`;
        } else {
          // Ordered fallback attempts
          const fallbackPorts = [3000, 3001, 3002];
          targetUrl = `http://localhost:${fallbackPorts[0]}/interview-terminated?data=${enc}`;
        }
        console.log('[AntiCheat] Redirecting to termination page:', targetUrl);
        mainWindow.loadURL(targetUrl);
      } catch (e) {
        console.error('[AntiCheat] Failed to redirect to termination page:', e.message);
      }
    }
  }, 1200);
  // safety: if redirect fails or hangs, allow another termination attempt after 30s
  setTimeout(() => { terminationInProgress = false; }, 30000);
  // Cancel any pending delayed monitoring start (test ended)
  if (routeMonitorDelay) { try { clearTimeout(routeMonitorDelay); } catch {} routeMonitorDelay = null; }
}

// Wrapper adopting naming from troubleshooting guidance
function terminateSession(result) {
  try {
    const processes = result?.banned || result?.processes || [];
    terminateInterviewSession(processes, {
      processes,
      criticalViolations: result.critical_violations || result.criticalViolations || [],
      highSeverityViolations: result.high_severity_violations || result.highSeverityViolations || [],
      threatLevel: result.threat_level || result.threatLevel || 'unknown',
      shouldTerminate: true
    });
  } catch (e) {
    console.error('[AntiCheat] terminateSession wrapper failed:', e.message);
  }
}

// (Removed earlier simple findDevPort – consolidated advanced version below)

// Preload scan: check for violations before first UI load
async function checkStartupViolations() {
  try {
    const scanResult = await runAntiCheatScan();
    const violations = scanResult.raw?.banned || [];
    const criticalViolations = scanResult.raw?.critical_violations || [];
    const highViolations = scanResult.raw?.high_severity_violations || [];
    
    if (violations.length > 0) {
      console.log('[AntiCheat][Startup] Detected violations at startup:', violations);
      return {
        hasViolations: true,
        violations,
        criticalViolations,
        highViolations,
        threatLevel: scanResult.raw?.threat_level || 'medium',
        shouldBlock: criticalViolations.length > 0 || highViolations.length > 0
      };
    }
    
    return { hasViolations: false };
  } catch (error) {
    console.error('[AntiCheat][Startup] Failed to check startup violations:', error);
    return { hasViolations: false, error: error.message };
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '..', 'public', 'codevail-logo.png'),
    title: 'CodeVail - Interview Platform',
    titleBarStyle: 'default',
    show: true, // Show immediately instead of waiting
    backgroundColor: '#ffffff', // Set background color to avoid flash
  });

  // Remove default application menu (File/Edit/View/Help)
  try { Menu.setApplicationMenu(null); } catch(e) { console.warn('Menu removal failed', e.message); }

  // Load app (with startup violation check in dev)
  if (isDev) {
    // Try to find available dev server port
  const ports = [3000, 3001, 3002, 3003, 3004, 3005]; // Prefer 3000 (common Next.js default)
    findDevPort(ports).then(async (port) => {
      if (port) {
        devPort = port;
        const url = `http://localhost:${port}`;
        currentBaseUrl = url;
        console.log('Loading dev URL:', url);
        
        // Check for startup violations
        const startupCheck = await checkStartupViolations();
        if (startupCheck.hasViolations) {
          const warningPayload = {
            processes: startupCheck.violations,
            threatLevel: startupCheck.threatLevel,
            critical: startupCheck.criticalViolations,
            high: startupCheck.highViolations,
            ts: Date.now()
          };
          const enc = encodeURIComponent(Buffer.from(JSON.stringify(warningPayload)).toString('base64'));
          if (startupCheck.shouldBlock) {
            console.log('[AntiCheat][Startup] Blocking startup due to critical violations');
          } else {
            console.log('[AntiCheat][Startup] Warning about medium violations');
          }
          mainWindow.loadURL(`${url}/anti-cheat-warning?data=${enc}`);
        } else {
          mainWindow.loadURL(url);
        }
      } else {
        console.error('No dev server found on localhost:3000-3005');
        const fallbackUrl = `http://localhost:3000`;
        devPort = 3000;
        currentBaseUrl = fallbackUrl;
        console.log('Loading fallback URL:', fallbackUrl);
        mainWindow.loadURL(fallbackUrl);
      }
    }).catch((error) => {
      console.error('Error finding dev port:', error);
      const fallbackUrl = `http://localhost:3000`;
      devPort = 3000;
      currentBaseUrl = fallbackUrl;
      console.log('Loading final fallback URL:', fallbackUrl);
      mainWindow.loadURL(fallbackUrl);
    });
  } else {
    const startUrl = `file://${path.join(__dirname, '../out/index.html')}`;
    console.log('Loading production URL:', startUrl);
    mainWindow.loadURL(startUrl);
    currentBaseUrl = startUrl;
  }

  // Setup anti-cheat monitoring and bootstrap scans on each load
  mainWindow.webContents.on('did-finish-load', () => {
    // Store reference globally for anti-cheat logger
    global.mainWindow = mainWindow;
    // If we just loaded termination page, clear termination flag early
    try {
      const loadedUrl = mainWindow.webContents.getURL();
      if (loadedUrl.includes('/interview-terminated')) {
        if (terminationInProgress) {
          terminationInProgress = false;
          console.log('[AntiCheat] terminationInProgress cleared (termination page loaded)');
        }
      }
    } catch {}
    
  // One‑time monitoring init
    if (!monitoringInitialized) {
      setupAntiCheatMonitoring();
      monitoringInitialized = true;
        // If a route activation arrived early, schedule it now
        if (pendingRouteMonitoringStart) {
          console.log('[AntiCheat] Fulfilling pending route-based monitoring start');
          pendingRouteMonitoringStart = false;
          try { scheduleMonitoringStart(); } catch (e) { console.warn('[AntiCheat] Failed pending start:', e.message); }
        }
    }

    // Optional automatic dev session (no UI interaction needed) if env flag set
    if (isDev && process.env.AUTO_ANTICHEAT === '1') {
      try {
        if (!antiCheatLogger.getCurrentStatus().isActive) {
          antiCheatLogger.startSession('DevAutoCandidate', 'auto-' + Date.now(), { role: 'candidate', testStarted: true });
          console.log('[AntiCheat][AUTO] Dev auto session initialized');
        }
        // Ensure monitoring starts
        try { ipcMain.emit('anti-cheat-mark-test-started'); } catch {}
        // Fallback direct start if still idle after small delay
        setTimeout(() => {
          const status = antiCheatLogger.getCurrentStatus();
            if (global.startMonitoring && status.testStarted) {
              try { global.startMonitoring(); } catch {}
            }
        }, 600);
      } catch (e) {
        console.error('[AntiCheat][AUTO] Failed to auto-start session:', e.message);
      }
    }
    
    if (isDev) {
      // Open DevTools in development
      mainWindow.webContents.openDevTools();
    }

  // Lightweight periodic bootstrap scan (only active once test actually starts)
    function startBootstrapScanner() {
      if (bootstrapScanInterval) return;
      bootstrapScanInterval = setInterval(async () => {
        if (terminationInProgress) return;
        try {
          const status = (() => { try { return antiCheatLogger.getCurrentStatus() || {}; } catch { return {}; } })();
          // Only operate bootstrap scans while a test is explicitly started
          if (!status.testStarted) return;
          const isCandidate = (status.role || 'candidate') === 'candidate';
          const scan = await runAntiCheatScan();
          if (isCandidate && scan.public.shouldTerminate) {
            if (testGraceUntil && Date.now() < testGraceUntil) {
              console.log('[AntiCheat][BOOT][GRACE] Violation detected but within grace window; suppression active');
            } else {
              console.log('[AntiCheat][BOOT] Terminating via bootstrap scan...');
              terminateSession(scan.raw);
              if (bootstrapScanInterval) { clearInterval(bootstrapScanInterval); bootstrapScanInterval = null; }
              return;
            }
          }
        } catch (e) {
          console.warn('[AntiCheat][BOOT] bootstrap scan error:', e.message);
        }
      }, 6000);
    }
    startBootstrapScanner();
  });

  // SPA navigations (monitoring only starts via explicit IPC now)
  const NAV_DEBUG = (process.env.ANTI_CHEAT_NAV_DEBUG || '0') === '1';
  mainWindow.webContents.on('did-navigate-in-page', (_e, url) => {
    if (NAV_DEBUG) console.log('[Nav] did-navigate-in-page', url);
  });
  mainWindow.webContents.on('did-navigate', (_e, url) => {
    if (NAV_DEBUG) console.log('[Nav] did-navigate', url);
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (bootstrapScanInterval) { try { clearInterval(bootstrapScanInterval); } catch {} bootstrapScanInterval = null; }
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDesc, validatedURL) => {
    console.error('[App] Failed to load URL:', { errorCode, errorDesc, validatedURL, attempt: loadAttempts });
    if (loadAttempts < MAX_LOAD_ATTEMPTS && currentBaseUrl && currentBaseUrl.startsWith('http')) {
      const retryDelay = 1200 + (loadAttempts * 300);
      loadAttempts++;
      console.warn(`[App] Retry loading (${loadAttempts}/${MAX_LOAD_ATTEMPTS}) in ${retryDelay}ms...`);
      setTimeout(() => {
        if (!mainWindow?.isDestroyed()) {
          mainWindow.loadURL(currentBaseUrl).catch(e => console.error('[App] Retry load failed:', e.message));
        }
      }, retryDelay);
    } else if (isDev && !devRelocationAttempted) {
      devRelocationAttempted = true;
      console.warn('[App] Initiating dev port relocation scan (3000-3010)...');
      const expanded = Array.from({length:11}, (_,i)=>3000+i);
      findDevPort(expanded).then(np => {
        if (np && np !== devPort) {
          devPort = np;
          currentBaseUrl = `http://localhost:${np}`;
          console.log('[App] Relocating to active Next.js dev port:', np);
          if (!mainWindow?.isDestroyed()) mainWindow.loadURL(currentBaseUrl);
        } else {
          console.warn('[App] Relocation scan found no alternative active port');
        }
      }).catch(e => console.error('[App] Relocation scan error:', e.message));
    }
  });

  // Extra diagnostics for unexpected renderer exits
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('[Diag] Renderer process gone:', details);
  });
  mainWindow.webContents.on('unresponsive', () => {
    console.warn('[Diag] Renderer became unresponsive');
  });
  mainWindow.webContents.on('responsive', () => {
    console.log('[Diag] Renderer responsive again');
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const isLocalhost = parsedUrl.hostname === 'localhost';
    if (!isLocalhost && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });
}

// Identify routes considered "test" contexts
function isTestRoute(route) {
  if (!route) return false;
  const base = process.env.ANTI_CHEAT_TEST_ROUTE_BASE || '/interview';
  
  // Support multiple test route patterns
  const testRoutes = [
    '/interview',
    '/interview-code', 
    '/tech-interview',
    '/code',
    '/coding-environment'
  ];
  
  for (const testBase of testRoutes) {
    const match = route === testBase || route === testBase + '/' || route.startsWith(testBase + '/');
    if (match) {
      try { console.log('[AntiCheat][RouteEval] Route considered TEST route:', route, 'matchedBase=', testBase); } catch {}
      return true;
    }
  }
  
  try { console.log('[AntiCheat][RouteEval] Non-test route:', route, 'candidates=', testRoutes); } catch {}
  return false;
}

function ensureSessionExists() {
  try {
    const status = antiCheatLogger.getCurrentStatus();
    if (!status.isActive) {
      const interviewId = 'session-' + Date.now();
      antiCheatLogger.startSession('Candidate', interviewId, { role: 'candidate', testStarted: true });
      console.log('[AntiCheat] Auto-created session on test route enter');
      testGraceUntil = Date.now() + 10000; // grace for immediate startup
    } else if (!status.testStarted) {
      antiCheatLogger.markTestStarted();
      testGraceUntil = Date.now() + 10000;
    }
    const dbg = antiCheatLogger.getCurrentStatus();
    console.log('[AntiCheat][DBG] ensureSessionExists status:', {
      sessionId: dbg.sessionId,
      isActive: dbg.isActive,
      testStarted: dbg.testStarted,
      testState
    });
  } catch (e) { console.warn('[AntiCheat] ensureSessionExists failed:', e.message); }
}

function scheduleMonitoringStart() {
  if (!global.startMonitoring) return;
  if (routeMonitorDelay) { clearTimeout(routeMonitorDelay); routeMonitorDelay = null; }
  console.log('[AntiCheat] Scheduling monitoring start (route grace 5s)');
  routeMonitorDelay = setTimeout(() => {
    if (testState === 'completed') return;
    try {
      console.log('[AntiCheat] Starting monitoring after route grace window');
      global.startMonitoring();
    } catch (e) { console.warn('[AntiCheat] Delayed start failed:', e.message); }
  }, Number(process.env.ANTI_CHEAT_ROUTE_GRACE_MS || 5000));
}

// Debounced route handler (shared IPC channels)
function handleRouteChange(route) {
  try { console.log('[AntiCheat][IPC] Raw route event:', route); } catch {}
  if (routeDebounceTimer) { clearTimeout(routeDebounceTimer); }
  const candidate = route || '';
  // Debounce burst of same or transitional routes
  routeDebounceTimer = setTimeout(() => {
    if (candidate === lastRouteProcessed) {
      // Duplicate stable route; ignore
      return;
    }
    lastRouteProcessed = candidate;
    console.log('[AntiCheat][IPC] Debounced stable route:', candidate);
    // Clear any pending delayed start from previous route
    if (routeMonitorDelay) { clearTimeout(routeMonitorDelay); routeMonitorDelay = null; }
    if (!isTestRoute(candidate)) {
      if (global.pauseMonitoring) {
        console.log('[AntiCheat] Non-test route -> pausing monitoring (re-armable)');
        try { global.pauseMonitoring(); } catch {}
      } else if (global.stopMonitoring && testState !== 'completed') {
        console.log('[AntiCheat] Fallback stopMonitoring (pause unavailable)');
        try { global.stopMonitoring(); } catch {}
      }
      return;
    }
    // Re-entry to a test route after a termination: clear stale termination flag so checks can resume
    if (terminationInProgress) {
      const since = lastTerminationAt ? (Date.now() - lastTerminationAt) : null;
      if (!lastTerminationAt || since > 1500) { // allow quick re-arm after redirect
        console.log('[AntiCheat] Clearing stale terminationInProgress on test route re-entry (since=', since, 'ms)');
        terminationInProgress = false;
      }
    }
    ensureSessionExists();
    if (!global.startMonitoring) {
      console.log('[AntiCheat] startMonitoring not yet ready; deferring activation');
      pendingRouteMonitoringStart = true;
      return;
    }
    console.log('[AntiCheat] Test route detected -> scheduling monitoring (after grace)');
    scheduleMonitoringStart();
  }, ROUTE_DEBOUNCE_MS);
}

// Route change IPC
ipcMain.on('anti-cheat-set-route', (_e, route) => handleRouteChange(route));
ipcMain.on('routeChanged', (_e, route) => handleRouteChange(route));

// Soft vs hard reset channels
ipcMain.on('antiCheat:resetSession', () => {
  try {
    if (routeMonitorDelay) { clearTimeout(routeMonitorDelay); routeMonitorDelay = null; }
    resetAntiCheatState();
    if (antiCheatLogger.reset) { antiCheatLogger.reset(); }
    console.log('[AntiCheat] Soft session reset via IPC');
  } catch (e) { console.warn('[AntiCheat] resetSession failed:', e.message); }
});

ipcMain.on('antiCheat:hardResetSession', () => {
  try {
    if (routeMonitorDelay) { clearTimeout(routeMonitorDelay); routeMonitorDelay = null; }
    resetAntiCheatState();
    antiCheatLogger.endSession();
    console.log('[AntiCheat] HARD session reset via IPC');
  } catch (e) { console.warn('[AntiCheat] hardResetSession failed:', e.message); }
});

function startNextServer() {
  createWindow();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  startNextServer();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle app quit
app.on('before-quit', () => {
  // End anti-cheat session on app quit
  antiCheatLogger.endSession();
});

// Anti-cheat monitoring setup
function setupAntiCheatMonitoring() {
  if (!mainWindow) {
    console.log('[AntiCheat] Cannot setup monitoring - no main window');
    return;
  }

  console.log('[AntiCheat] Setting up monitoring system...');

    // 1. Focus events
  let lastFocusTime = Date.now();
  let focusLostTime = null;

  mainWindow.on('blur', () => {
    if (testState === 'active') {
      focusLostTime = Date.now();
      antiCheatLogger.logEvent('WINDOW_LOST_FOCUS', {
        duration: 0,
        timestamp: new Date().toISOString()
      });
    }
  });

  mainWindow.on('focus', () => {
    if (testState === 'active' && focusLostTime) {
      const duration = Date.now() - focusLostTime;
      antiCheatLogger.logEvent('WINDOW_REGAINED_FOCUS', {
        duration,
        awayTimeSeconds: Math.round(duration / 1000),
        timestamp: new Date().toISOString()
      });
      focusLostTime = null;
    }
  });

  // 2. Process polling
  function runProcessCheck() {
  // Stop any further periodic scans once termination begins or session completed
  if (terminationInProgress || testState === 'completed') return;
  if (testState !== 'active') return; // strictly require explicit activation
    console.log('[AntiCheat] Running process check (active)...');
    try {
      const spawn = require('child_process').spawn;
      const pythonScript = path.join(__dirname, '..', 'backend', 'services', 'anti_cheat.py');
      const python = spawn('python', [pythonScript]);
      let output = '';
      python.stdout.on('data', (data) => { output += data.toString(); });
      python.on('close', (code) => {
        if (code !== 0 || !output.trim()) return;
        try {
          const result = JSON.parse(output);
          if (!result.banned || result.banned.length === 0) return;
          const eventData = {
            processes: result.banned,
            criticalViolations: result.critical_violations || [],
            highSeverityViolations: result.high_severity_violations || [],
            threatLevel: result.threat_level || 'medium',
            shouldTerminate: result.should_terminate || false
          };
          antiCheatLogger.logEvent('SUSPICIOUS_PROCESS', eventData);
          // Enhanced termination decision & diagnostics
          try {
            const status = (() => { try { return antiCheatLogger.getCurrentStatus() || {}; } catch { return {}; } })();
            const loggerTestStarted = Boolean(status.testStarted || status.test_started || false);
            const roleFromLogger = (status.role || 'candidate');
            const isCandidate = roleFromLogger === 'candidate';
            const willTerminate = Boolean(eventData.shouldTerminate);
            const sessionActive = (testState === 'active') || loggerTestStarted;

            console.log('[AntiCheat][DECIDE] willTerminate=', willTerminate,
              'isCandidate=', isCandidate,
              'loggerTestStarted=', loggerTestStarted,
              'testState=', testState,
              'sessionActive=', sessionActive,
              'role=', roleFromLogger,
              'terminationInProgress=', terminationInProgress,
              'eventData=', eventData);

            if (willTerminate && isCandidate && sessionActive) {
              // Grace period suppression
              if (testGraceUntil && Date.now() < testGraceUntil) {
                console.log('[AntiCheat][GRACE] Suppressing termination inside periodic process check until', new Date(testGraceUntil).toISOString());
              } else if (!terminationInProgress) {
                terminationInProgress = true;
                console.log('[AntiCheat] Terminating due to violation:', eventData);
                terminateInterviewSession(result.banned || eventData.processes || [], eventData);
              } else {
                console.warn('[AntiCheat] Termination already in progress; ignoring duplicate trigger.');
              }
            } else {
              console.log('[AntiCheat] Termination condition not met (willTerminate && isCandidate && sessionActive prerequisite failed).');
            }
          } catch (e) { console.error('[AntiCheat] Termination eval error:', e.message); }
          if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.send('anti-cheat-violation', eventData);
          }
        } catch (parseError) {
          console.error('[AntiCheat] Parse process result error:', parseError);
        }
      });
    } catch (err) { console.error('[AntiCheat] Process check spawn failed:', err); }
  }
  global.runProcessCheck = runProcessCheck; // exposed but only acts when active

  function startClipboardMonitoring() {
    let lastClipboardContent = '';
    clipboardCheckInterval = setInterval(() => {
      if (testState !== 'active') return;
      try {
        const currentContent = clipboard.readText();
        if (currentContent && currentContent !== lastClipboardContent) {
          const isLargePaste = currentContent.length > 100;
          antiCheatLogger.logEvent('CLIPBOARD_CHANGE', {
            contentLength: currentContent.length,
            isLargePaste,
            containsCode: /[{}();]/.test(currentContent),
            timestamp: new Date().toISOString()
          });
          if (isLargePaste) {
            antiCheatLogger.logEvent('LARGE_PASTE_DETECTED', {
              contentLength: currentContent.length,
              preview: currentContent.substring(0, 50) + '...',
              timestamp: new Date().toISOString()
            });
          }
          lastClipboardContent = currentContent;
        }
      } catch (error) { console.error('[AntiCheat] Clipboard check failed:', error); }
    }, 5000);
  }

  function startMonitoring() {
    // Allow re-entry only if intervals not yet created
    if (!CHILD_MODE) {
      if (processCheckInterval) {
        console.log('[AntiCheat] startMonitoring called but interval already exists');
        return;
      }
    }
    // If we are starting (or re-arming) monitoring after a prior termination, clear flag
    if (terminationInProgress) {
      const since = lastTerminationAt ? (Date.now() - lastTerminationAt) : null;
      console.log('[AntiCheat] Resetting terminationInProgress on startMonitoring (since last termination =', since, 'ms)');
      terminationInProgress = false;
    }
    if (testState === 'completed') {
      // Completed was previously terminal; allow re-arm if a new session was created
      console.log('[AntiCheat] startMonitoring from completed -> rearming (new session assumed)');
      testState = 'idle';
    }
    if (testState === 'idle') testState = 'active';
    console.log('[AntiCheat] Monitoring ACTIVATED (state=' + testState + ')');
    if (CHILD_MODE) {
      // Spawn or restart child worker
      try {
        if (antiCheatChild) {
          try { antiCheatChild.kill(); } catch {}
          antiCheatChild = null;
        }
        const workerPath = path.join(__dirname, 'antiCheatWorker.js');
        antiCheatChild = fork(workerPath, [], { stdio: ['inherit','inherit','inherit','ipc'] });
        console.log('[AntiCheat] Child worker spawned pid=' + antiCheatChild.pid);
        antiCheatChild.on('message', (msg) => {
          if (!msg || typeof msg !== 'object') return;
          if (msg.type === 'heartbeat') {
            lastHeartbeatTs = msg.ts;
            return;
          }
          if (msg.type === 'scan') {
            handleExternalScan(msg.data);
            return;
          }
          if (msg.type === 'scan-error' || msg.type === 'spawn-error') {
            console.warn('[AntiCheat][Child]', msg.type, msg.error);
          }
        });
        antiCheatChild.on('exit', (code, sig) => {
          console.log('[AntiCheat] Child worker exited code=' + code + ' sig=' + sig);
        });
      } catch (e) {
        console.error('[AntiCheat] Failed to spawn child worker:', e.message);
      }
    } else {
      processCheckInterval = setInterval(runProcessCheck, 7000);
      startClipboardMonitoring();
      setTimeout(runProcessCheck, 600); // slight delay for environment readiness
    }
  }

  function stopMonitoring() {
  if (testState === 'completed') return;
  testState = 'completed';
    console.log('[AntiCheat] Monitoring STOPPED');
    if (CHILD_MODE) {
      if (antiCheatChild) { try { antiCheatChild.kill(); } catch {}; antiCheatChild = null; }
    } else {
      if (processCheckInterval) { clearInterval(processCheckInterval); processCheckInterval = null; }
      if (clipboardCheckInterval) { clearInterval(clipboardCheckInterval); clipboardCheckInterval = null; }
    }
  }

  function pauseMonitoring() {
  // Non-terminal pause on route leave
    if (testState !== 'active') {
      // Nothing to pause
    } else {
      console.log('[AntiCheat] Monitoring PAUSED (route change)');
    }
    if (CHILD_MODE) {
      if (antiCheatChild) { try { antiCheatChild.kill(); } catch {}; antiCheatChild = null; }
    } else {
      if (processCheckInterval) { clearInterval(processCheckInterval); processCheckInterval = null; }
      if (clipboardCheckInterval) { clearInterval(clipboardCheckInterval); clipboardCheckInterval = null; }
    }
    if (testState !== 'completed') testState = 'idle';
  }

  global.startMonitoring = startMonitoring;
  global.stopMonitoring = stopMonitoring;
  global.pauseMonitoring = pauseMonitoring;

  // 4. Screen share helper
  global.startScreenShare = async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen'] });
      for (const source of sources) {
        if (source.name === 'Entire Screen' || source.name.includes('Screen')) {
          antiCheatLogger.logEvent('SCREEN_SHARE_STARTED', {
            sourceName: source.name,
            sourceId: source.id,
            timestamp: new Date().toISOString()
          });
          return source.id;
        }
      }
    } catch (error) {
      console.error('[AntiCheat] Screen capture setup failed:', error);
    }
  };

  // Clean up intervals when window is closed
  mainWindow.on('closed', () => {
    if (processCheckInterval) clearInterval(processCheckInterval);
    if (clipboardCheckInterval) clearInterval(clipboardCheckInterval);
    antiCheatLogger.endSession();
  });

  console.log('[AntiCheat] Monitoring system initialized');
}

// ----------------------------------------------------------------------------
// IPC: session + status
// ----------------------------------------------------------------------------
ipcMain.on('anti-cheat-mark-test-started', () => {
  try {
    antiCheatLogger.markTestStarted();
    console.log('[AntiCheat][IPC] Test marked started in logger');
    testGraceUntil = Date.now() + 10000; // 10s grace
    console.log('[AntiCheat][IPC] Grace period active until', new Date(testGraceUntil).toISOString());
      // Starting a fresh test should also clear any lingering termination state
      if (terminationInProgress) {
        console.log('[AntiCheat][IPC] Clearing lingering terminationInProgress on test start');
        terminationInProgress = false;
      }

    if (global.startMonitoring) {
      const prevState = testState;
      try { global.startMonitoring(); } catch (e) { console.error('[AntiCheat][IPC] startMonitoring fail', e.message); }
      console.log('[AntiCheat][IPC] startMonitoring invoked (previous state=' + prevState + ', current=' + testState + ')');
    } else {
      console.warn('[AntiCheat][IPC] startMonitoring not yet available');
    }

    try {
      const status = antiCheatLogger.getCurrentStatus();
      console.log('[AntiCheat][IPC] Logger status after markTestStarted:', status);
    } catch (e) {
      console.warn('[AntiCheat][IPC] could not read logger status:', e.message);
    }
  } catch (e) {
    console.error('[AntiCheat][IPC] markTestStarted failed', e.message);
  }
});
// Backwards-compatible aliases
ipcMain.on('mark-test-started', () => {
  try { ipcMain.emit('anti-cheat-mark-test-started'); } catch {}
});
ipcMain.on('anti-cheat-set-role', (e, role) => {
  try {
    antiCheatLogger.setRole(role);
    console.log('[AntiCheat][IPC] Role set to', role);
  } catch (e) { console.error('[AntiCheat][IPC] setRole failed', e.message); }
});
ipcMain.on('set-user-role', (e, role) => {
  try { ipcMain.emit('anti-cheat-set-role', e, role); } catch {}
});
ipcMain.on('anti-cheat-mark-test-ended', () => {
  try {
    console.log('[AntiCheat][IPC] Test ended');
    if (global.stopMonitoring) { try { global.stopMonitoring(); } catch {} }
    // Do not end session automatically; allows restart without full reset
    antiCheatLogger.logEvent('TEST_ENDED', { sessionId: antiCheatLogger.sessionId });
    testGraceUntil = null;
    try { testState = 'idle'; } catch {}
  } catch (e) {
    console.error('[AntiCheat][IPC] markTestEnded failed', e.message);
  }
});
ipcMain.handle('anti-cheat-start-session', (e, candidateName, interviewId, options) => {
  try {
    antiCheatLogger.startSession(candidateName, interviewId, options || {});
    console.log('[AntiCheat][IPC] Session started', { candidateName, interviewId, options });
    // Reset engine state for a fresh session
    resetAntiCheatState();
    // If caller indicates test already started, arm monitoring immediately
    const startNow = !!(options && options.testStarted);
    if (startNow && global.startMonitoring) { try { global.startMonitoring(); } catch {} }
  } catch (e) { console.error('[AntiCheat][IPC] startSession failed', e.message); }
});
ipcMain.on('anti-cheat-stop-monitoring', () => {
  try { if (global.stopMonitoring) global.stopMonitoring(); } catch {}
});

// Force start (dev)
ipcMain.on('anti-cheat-force-start', () => {
  try {
    console.log('[AntiCheat][IPC] FORCE START requested');
    if (global.startMonitoring) { global.startMonitoring(); }
  } catch (e) { console.error('[AntiCheat][IPC] force-start failed', e.message); }
});

// Query aggregated status
ipcMain.handle('anti-cheat-status', () => {
  try {
    const loggerStatus = (() => { try { return antiCheatLogger.getCurrentStatus() || {}; } catch { return {}; } })();
    return {
      testState,
      pendingRouteMonitoringStart,
      lastRouteProcessed,
      routeMonitorDelayActive: Boolean(routeMonitorDelay),
      graceRemainingMs: testGraceUntil ? Math.max(0, testGraceUntil - Date.now()) : 0,
      childMode: CHILD_MODE,
      lastHeartbeatAgeMs: lastHeartbeatTs ? (Date.now() - lastHeartbeatTs) : null,
      loggerStatus
    };
  } catch (e) {
    return { error: e.message };
  }
});

// One-off diagnostic scan (no termination)
ipcMain.handle('anti-cheat-diagnose', async () => {
  try {
    const scan = await runAntiCheatScan();
    const parsed = scan.raw || {};
    const loggerStatus = (() => { try { return antiCheatLogger.getCurrentStatus() || {}; } catch { return {}; } })();
    const role = (loggerStatus.role || 'candidate');
    const isCandidate = role === 'candidate';
    const sessionActive = (testState === 'active') || loggerStatus.testStarted;
    const inGrace = testGraceUntil && Date.now() < testGraceUntil;
    const wouldTerminate = Boolean(parsed.should_terminate) && isCandidate && sessionActive && !inGrace;
    return {
      scan: {
        banned: parsed.banned || [],
        critical: parsed.critical_violations || [],
        high: parsed.high_severity_violations || [],
        threatLevel: parsed.threat_level || 'none',
        rawShouldTerminate: !!parsed.should_terminate
      },
      context: {
        testState,
        loggerTestStarted: !!loggerStatus.testStarted,
        role,
        isCandidate,
        sessionActive,
        inGrace,
        graceRemainingMs: inGrace ? (testGraceUntil - Date.now()) : 0,
        pendingRouteMonitoringStart,
        lastRouteProcessed,
        childMode: CHILD_MODE
      },
      decision: {
        wouldTerminate,
        terminationBlockedReason: !parsed.should_terminate ? 'scan_not_severe' : (!isCandidate ? 'not_candidate_role' : (!sessionActive ? 'session_not_active' : (inGrace ? 'grace_period' : null)))
      }
    };
  } catch (e) {
    return { error: e.message };
  }
});

// Allow renderer to fully reset anti-cheat state (e.g., after logout/login)
ipcMain.on('anti-cheat-reset', () => {
  console.log('[AntiCheat][IPC] Reset requested');
  resetAntiCheatState();
  try { antiCheatLogger.endSession(); } catch {}
  testGraceUntil = null;
});
ipcMain.on('mark-test-ended', () => {
  try { ipcMain.emit('anti-cheat-mark-test-ended'); } catch {}
});
ipcMain.on('start-session', () => {
  try {
    const candidateName = 'Candidate';
    const interviewId = 'session-' + Date.now();
    antiCheatLogger.startSession(candidateName, interviewId, { role: 'candidate', testStarted: false });
    console.log('[AntiCheat][IPC] (alias) start-session created session');
  } catch (e) { console.error('[AntiCheat][IPC] alias start-session failed', e.message); }
});

// On-demand scan + possible termination
ipcMain.handle('scan-for-violations', async () => {
  try {
    const scanResult = await runAntiCheatScan();
    const status = antiCheatLogger.getCurrentStatus();
    const isCandidate = (status.role || 'candidate') === 'candidate';
    // Removed auto-activation: test must be explicitly started via markTestStarted IPC.
    // This prevents premature termination before candidate actually begins the test.
    if (status.testStarted && isCandidate && scanResult.public.shouldTerminate) {
      if (testGraceUntil && Date.now() < testGraceUntil) {
        console.log('[AntiCheat][GRACE] Suppressing termination in on-demand scan until', new Date(testGraceUntil).toISOString());
      } else {
        console.log('[AntiCheat] Critical violation, terminating via on-demand scan...');
        terminateSession(scanResult.raw);
      }
    }
    return scanResult.public; // minimal payload back to renderer
  } catch (e) {
    console.error('[AntiCheat] scan-for-violations handler error:', e.message);
    return { banned: [], criticalViolations: [], highSeverityViolations: [], threatLevel: 'none', shouldTerminate: false };
  }
});

// Utilities: locate dev port heuristically
function checkForNextServer(port, timeout = 1000) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: 'localhost', port, path: '/', timeout }, (res) => {
      const ctype = (res.headers && (res.headers['content-type'] || res.headers['Content-Type'])) || '';
      const powered = (res.headers && (res.headers['x-powered-by'] || res.headers['X-Powered-By'])) || '';
      // Heuristics: Next dev serves HTML on '/', and often sets x-powered-by: Next.js
      const looksLikeNext = String(ctype).includes('text/html') || String(powered).toLowerCase().includes('next');
      // Drain quickly
      res.resume();
      resolve(looksLikeNext);
    });
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.on('error', () => resolve(false));
  });
}

// Shared scan helper
function runAntiCheatScan() {
  return new Promise((resolve) => {
    try {
      const spawn = require('child_process').spawn;
      const pythonScript = path.join(__dirname, '..', 'backend', 'services', 'anti_cheat.py');
      const python = spawn('python', [pythonScript]);
      let output = '';
      python.stdout.on('data', (d) => output += d.toString());
      python.on('error', () => {
        resolve({ public: { banned: [], criticalViolations: [], highSeverityViolations: [], threatLevel: 'none', shouldTerminate: false }, raw: {} });
      });
      python.on('close', (code) => {
        if (code !== 0 || !output.trim()) {
          return resolve({ public: { banned: [], criticalViolations: [], highSeverityViolations: [], threatLevel: 'none', shouldTerminate: false }, raw: {} });
        }
        try {
          const parsed = JSON.parse(output);
          const publicShape = {
            banned: parsed.banned || [],
            criticalViolations: parsed.critical_violations || [],
            highSeverityViolations: parsed.high_severity_violations || [],
            threatLevel: parsed.threat_level || 'none',
            shouldTerminate: !!parsed.should_terminate
          };
          if (publicShape.banned.length > 0) {
            antiCheatLogger.logEvent('PROCESS_SCAN', publicShape);
          }
          resolve({ public: publicShape, raw: parsed });
        } catch (err) {
          console.error('[AntiCheat] runAntiCheatScan parse error:', err.message);
          resolve({ public: { banned: [], criticalViolations: [], highSeverityViolations: [], threatLevel: 'none', shouldTerminate: false }, raw: {} });
        }
      });
    } catch (e) {
      console.error('[AntiCheat] runAntiCheatScan spawn error:', e.message);
      resolve({ public: { banned: [], criticalViolations: [], highSeverityViolations: [], threatLevel: 'none', shouldTerminate: false }, raw: {} });
    }
  });
}

async function findDevPort(ports) {
  for (const p of ports) {
    // poll a few times until Next is ready
    for (let i = 0; i < 12; i++) {
      const isNext = await checkForNextServer(p);
      if (isNext) return p;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  return null;
}

// Crash guards
process.on('uncaughtException', (err) => {
  console.error('[Global] Uncaught exception:', err);
});

// Child worker scan handling
function handleExternalScan(parsed) {
  try {
    if (!parsed || !parsed.banned || parsed.banned.length === 0) return;
    const eventData = {
      processes: parsed.banned,
      criticalViolations: parsed.critical_violations || [],
      highSeverityViolations: parsed.high_severity_violations || [],
      threatLevel: parsed.threat_level || 'medium',
      shouldTerminate: !!parsed.should_terminate
    };
    antiCheatLogger.logEvent('SUSPICIOUS_PROCESS', eventData);
    const status = (() => { try { return antiCheatLogger.getCurrentStatus() || {}; } catch { return {}; } })();
    const isCandidate = (status.role || 'candidate') === 'candidate';
    const sessionActive = testState === 'active' || status.testStarted;
    if (eventData.shouldTerminate && isCandidate && sessionActive) {
      if (testGraceUntil && Date.now() < testGraceUntil) {
        console.log('[AntiCheat][GRACE][Child] Suppressing termination inside grace window');
      } else if (!terminationInProgress) {
        terminationInProgress = true;
        console.log('[AntiCheat][Child] Terminating due to violation');
        terminateInterviewSession(parsed.banned || eventData.processes || [], eventData);
      }
    }
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('anti-cheat-violation', eventData);
    }
  } catch (e) {
    console.error('[AntiCheat] handleExternalScan failed:', e.message);
  }
}
process.on('unhandledRejection', (reason) => {
  console.error('[Global] Unhandled rejection:', reason);
});

// More detailed crash monitoring (Electron 14+ APIs)
app.on('render-process-gone', (event, webContents, details) => {
  console.error('[Diag] App-level render-process-gone:', details);
});
app.on('child-process-gone', (event, details) => {
  console.error('[Diag] Child process gone:', details);
});
app.on('gpu-process-crashed', () => {
  console.error('[Diag] GPU process crashed');
});

process.on('exit', (code) => {
  console.log('[Diag] Process exiting with code', code);
});
