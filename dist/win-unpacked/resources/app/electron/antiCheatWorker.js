// Standalone anti-cheat worker process.
// Spawns the Python scanner periodically and reports violations / heartbeats to parent via process.send.

const path = require('path');
const { spawn } = require('child_process');

const SCAN_INTERVAL_MS = Number(process.env.ANTI_CHEAT_SCAN_INTERVAL_MS || 7000);
const HEARTBEAT_INTERVAL_MS = Number(process.env.ANTI_CHEAT_HEARTBEAT_MS || 5000);
let terminated = false;

function runScan() {
  if (terminated) return;
  const script = path.join(__dirname, '..', 'backend', 'services', 'anti_cheat.py');
  const py = spawn('python', [script]);
  let output = '';
  py.stdout.on('data', d => { output += d.toString(); });
  py.on('close', code => {
    if (terminated) return;
    if (code === 0 && output.trim()) {
      try {
        // Grab last JSON line (scanner prints a debug stderr line + JSON stdout line)
        const lines = output.trim().split(/\r?\n/);
        const jsonLine = lines[lines.length - 1];
        const parsed = JSON.parse(jsonLine);
        process.send && process.send({ type: 'scan', data: parsed });
      } catch (e) {
        process.send && process.send({ type: 'scan-error', error: e.message });
      }
    }
  });
  py.on('error', e => {
    process.send && process.send({ type: 'spawn-error', error: e.message });
  });
}

// Heartbeat
setInterval(() => {
  if (terminated) return;
  process.send && process.send({ type: 'heartbeat', ts: Date.now() });
}, HEARTBEAT_INTERVAL_MS).unref();

// Scan loop
setInterval(runScan, SCAN_INTERVAL_MS).unref();
runScan(); // initial

process.on('message', msg => {
  if (!msg) return;
  if (msg.type === 'terminate-worker') {
    terminated = true;
    process.exit(0);
  }
});

console.log('[AntiCheatWorker] initialized pid=' + process.pid + ' at ' + new Date().toISOString());
