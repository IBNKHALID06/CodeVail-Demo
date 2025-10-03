const { contextBridge, ipcRenderer } = require('electron');
// Removed direct child_process usage in preload to avoid sandbox bundler "module not found: child_process" errors.
// All privileged process / python invocations are now centralized in the main process (scan-for-violations IPC).
// Keep preload lean: only pure JS + IPC + lightweight logger.
const path = require('path');

// Anti-cheat logger reference
const antiCheatLogger = require('./anti-cheat-logger');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// Lightweight fallback process list (degraded mode) — returns empty; real scan handled by main process.
async function scanProcesses() { return []; }

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  
  // Enhanced anti-cheat API with immediate termination support
  scanProcesses: async () => {
    // Deprecated direct OS scan: delegate to main authoritative scan for consistency & security.
    try {
      const result = await ipcRenderer.invoke('scan-for-violations');
      return (result?.banned || []).map(b => String(b).toLowerCase());
    } catch { return []; }
  },
  
  // Delegate severity/termination decision to main process authoritative handler
  scanForViolations: async () => {
    try {
      const result = await ipcRenderer.invoke('scan-for-violations');
      return result || { banned: [], criticalViolations: [], highSeverityViolations: [], threatLevel: 'none', shouldTerminate: false };
    } catch {
      // Absolute fallback to local lightweight scan (no termination authority)
      const processes = await scanProcesses();
      return { banned: processes, criticalViolations: [], highSeverityViolations: [], threatLevel: processes.length > 0 ? 'medium' : 'none', shouldTerminate: false, timestamp: Date.now() };
    }
  },

  // Anti-cheat session management
  startAntiCheatSession: (candidateName, interviewId) => {
  antiCheatLogger.startSession(candidateName, interviewId);
  ipcRenderer.invoke('anti-cheat-start-session', candidateName, interviewId, {});
  },
  startAntiCheatSessionWith: (candidateName, interviewId, options) => {
  antiCheatLogger.startSession(candidateName, interviewId, options || {});
  ipcRenderer.invoke('anti-cheat-start-session', candidateName, interviewId, options || {});
  },
  markTestStarted: () => {
  antiCheatLogger.markTestStarted();
  ipcRenderer.send('anti-cheat-mark-test-started');
  },
  // Explicit end of test (does NOT end entire session unless UI chooses)
  markTestEnded: () => {
    try {
      ipcRenderer.send('anti-cheat-mark-test-ended');
      // Backward-compatible alias channel name
      ipcRenderer.send('mark-test-ended');
      antiCheatLogger.logEvent('TEST_ENDED_REQUESTED');
    } catch {}
  },
  setUserRole: (role) => {
  antiCheatLogger.setRole(role);
  ipcRenderer.send('anti-cheat-set-role', role);
  // Alias simple channel for ergonomics
  ipcRenderer.send('set-user-role', role);
  },
  // Alias simplified API names for ergonomics (non-breaking additions)
  startSession: () => {
    try {
      const interviewId = 'session-' + Date.now();
      antiCheatLogger.startSession('Candidate', interviewId, { role: 'candidate', testStarted: false });
      ipcRenderer.invoke('anti-cheat-start-session', 'Candidate', interviewId, { role: 'candidate', testStarted: false });
      ipcRenderer.send('start-session');
    } catch {}
  },
  // Simple alias to explicit mark test started channels
  simpleMarkTestStarted: () => {
    try {
      ipcRenderer.send('anti-cheat-mark-test-started');
      ipcRenderer.send('mark-test-started');
    } catch {}
  },
  
  endAntiCheatSession: () => {
    antiCheatLogger.endSession();
  },

  resetAntiCheat: () => {
    try {
      ipcRenderer.send('anti-cheat-reset');
    } catch {}
  },
  
  getAntiCheatStatus: () => {
    return antiCheatLogger.getCurrentStatus();
  },
  
  getRecentEvents: (limit = 10) => {
    return antiCheatLogger.getRecentEvents(limit);
  },

  // Diagnostic: run scan + evaluate termination gating without enforcing it
  diagnoseAntiCheat: async () => {
    try { return await ipcRenderer.invoke('anti-cheat-diagnose'); } catch (e) { return { error: e.message }; }
  },

  // Screen sharing for interviewer
  startScreenShare: () => {
    return global.startScreenShare ? global.startScreenShare() : null;
  },

  // Event listeners for real-time updates
  onAntiCheatEvent: (callback) => {
    ipcRenderer.on('anti-cheat-event', (event, data) => callback(data));
  },

  onAntiCheatViolation: (callback) => {
    ipcRenderer.on('anti-cheat-violation', (event, data) => callback(data));
  },

  onInterviewTerminated: (callback) => {
    ipcRenderer.on('interview-terminated', (event, data) => callback(data));
  },
  // Unified termination listener (covers both legacy and new alias channel)
  onTerminated: (callback) => {
    ipcRenderer.on('interview-terminated', (_e, data) => callback(data));
    ipcRenderer.on('anti-cheat-terminated', (_e, data) => callback(data));
  },

  removeAntiCheatListener: () => {
    ipcRenderer.removeAllListeners('anti-cheat-event');
    ipcRenderer.removeAllListeners('anti-cheat-violation');
    ipcRenderer.removeAllListeners('interview-terminated');
    ipcRenderer.removeAllListeners('anti-cheat-terminated');
  },

  // Route change reporting (for delayed activation based on page)
  setCurrentRoute: (route) => {
    try { ipcRenderer.send('anti-cheat-set-route', route); } catch {}
  },
  // Compatibility alias for new lifecycle control
  routeChanged: (url) => {
    try { ipcRenderer.send('routeChanged', url); } catch {}
  },
  resetAntiCheatSession: () => {
    try { ipcRenderer.send('antiCheat:resetSession'); } catch {}
  }
});
