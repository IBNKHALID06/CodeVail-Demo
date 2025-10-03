const fs = require('fs');
const path = require('path');

class AntiCheatLogger {
  constructor() {
    this.events = [];
    this.isSessionActive = false;
    this.sessionId = null;
  this.role = 'candidate'; // default role
  this.testStarted = false; // flag to indicate coding test actually began
    this.clipboardHistory = [];
    this.lastClipboardText = '';
    this.suspiciousActivity = {
      windowSwitches: 0,
      suspiciousProcesses: [],
      clipboardEvents: 0,
      pasteAttempts: 0
    };
    
    this.logDir = path.join(__dirname, '..', 'logs');
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  startSession(candidateName, interviewId, options = {}) {
    this.sessionId = `${interviewId}_${Date.now()}`;
    this.isSessionActive = true;
    this.role = options.role || 'candidate';
    this.testStarted = !!options.testStarted;
    this.events = [];
    this.suspiciousActivity = {
      windowSwitches: 0,
      suspiciousProcesses: [],
      clipboardEvents: 0,
      pasteAttempts: 0
    };
    this.lastClipboardText = '';

    this.logEvent('SESSION_START', {
  candidateName,
      interviewId,
      sessionId: this.sessionId,
  role: this.role,
  testStarted: this.testStarted,
      timestamp: new Date().toISOString()
    });

    console.log(`[AntiCheat] Session started: ${this.sessionId}`);
  }

  endSession() {
    if (this.isSessionActive) {
      this.logEvent('SESSION_END', {
        sessionId: this.sessionId,
        totalEvents: this.events.length,
        suspiciousActivity: this.suspiciousActivity,
        timestamp: new Date().toISOString()
      });

      this.saveSessionLog();
      this.isSessionActive = false;
      this.testStarted = false;
      this.role = 'candidate';
      console.log(`[AntiCheat] Session ended: ${this.sessionId}`);
    }
  }

  // Soft reset: clear volatile state without writing a SESSION_END (used after termination redirect)
  reset() {
    this.events = [];
    this.suspiciousActivity = {
      windowSwitches: 0,
      suspiciousProcesses: [],
      clipboardEvents: 0,
      pasteAttempts: 0
    };
    this.lastClipboardText = '';
    this.testStarted = false;
    // Preserve sessionId & isSessionActive so a subsequent re-entry can decide to start fresh or not
    console.log('[AntiCheat][Logger] Soft reset applied');
  }

  logEvent(type, data = {}) {
    const event = {
      type,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      ...data
    };

    this.events.push(event);
    
    // Real-time console logging for development
    console.log(`[AntiCheat] ${type}:`, data);

    // Update suspicious activity counters
    this.updateSuspiciousActivity(type, data);

    // Broadcast to renderer if window exists
    if (global.mainWindow && !global.mainWindow.isDestroyed()) {
      global.mainWindow.webContents.send('anti-cheat-event', event);
    }
  }

  updateSuspiciousActivity(type, data) {
    switch (type) {
      case 'WINDOW_LOST_FOCUS':
        this.suspiciousActivity.windowSwitches++;
        break;
      case 'SUSPICIOUS_PROCESS':
        if (!this.suspiciousActivity.suspiciousProcesses.includes(data.processName)) {
          this.suspiciousActivity.suspiciousProcesses.push(data.processName);
        }
        break;
      case 'CLIPBOARD_CHANGE':
        this.suspiciousActivity.clipboardEvents++;
        break;
      case 'LARGE_PASTE_DETECTED':
        this.suspiciousActivity.pasteAttempts++;
        break;
    }
  }

  getSuspiciousActivityScore() {
    const weights = {
      windowSwitches: 2,
      suspiciousProcesses: 10,
      clipboardEvents: 1,
      pasteAttempts: 5
    };

    return (
      this.suspiciousActivity.windowSwitches * weights.windowSwitches +
      this.suspiciousActivity.suspiciousProcesses.length * weights.suspiciousProcesses +
      this.suspiciousActivity.clipboardEvents * weights.clipboardEvents +
      this.suspiciousActivity.pasteAttempts * weights.pasteAttempts
    );
  }

  getRiskLevel() {
    const score = this.getSuspiciousActivityScore();
    if (score >= 20) return 'HIGH';
    if (score >= 10) return 'MEDIUM';
    if (score >= 5) return 'LOW';
    return 'NONE';
  }

  saveSessionLog() {
    if (!this.sessionId) return;

    const logData = {
      sessionId: this.sessionId,
      events: this.events,
      suspiciousActivity: this.suspiciousActivity,
      riskLevel: this.getRiskLevel(),
      score: this.getSuspiciousActivityScore(),
      generatedAt: new Date().toISOString()
    };

    const filename = `session_${this.sessionId}.json`;
    const filepath = path.join(this.logDir, filename);

    try {
      fs.writeFileSync(filepath, JSON.stringify(logData, null, 2));
      console.log(`[AntiCheat] Session log saved: ${filepath}`);
    } catch (error) {
      console.error('[AntiCheat] Failed to save session log:', error);
    }
  }

  getRecentEvents(limit = 10) {
    return this.events.slice(-limit);
  }

  getCurrentStatus() {
    return {
      isActive: this.isSessionActive,
      sessionId: this.sessionId,
      eventCount: this.events.length,
      suspiciousActivity: this.suspiciousActivity,
      riskLevel: this.getRiskLevel(),
      score: this.getSuspiciousActivityScore(),
      role: this.role,
      testStarted: this.testStarted
    };
  }

  markTestStarted() {
    if (this.isSessionActive && !this.testStarted) {
      this.testStarted = true;
      this.logEvent('TEST_STARTED', { sessionId: this.sessionId });
    }
  }

  setRole(role) {
    if (this.isSessionActive) {
      this.role = role;
      this.logEvent('ROLE_SET', { role });
    }
  }
}

module.exports = new AntiCheatLogger();
