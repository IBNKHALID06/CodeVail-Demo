import sys
import os
import json
import time
import platform
import subprocess
from typing import List, Dict, Set

try:
    import psutil  # type: ignore
except ImportError:
    psutil = None  # We'll degrade gracefully; caller should install psutil

# Enhanced banned process list based on prototype findings
BANNED = [
    # AI/Chat assistants (critical violations) - Windows .exe format
    'cluely.exe', 'fuckleetcode.exe', 'chatgpt.exe', 'copilot.exe', 'codeium.exe', 'tabnine.exe', 'stackoverflow.exe',
    # Communication apps (high priority)
    'discord.exe', 'slack.exe', 'teams.exe', 'whatsapp.exe', 'telegram.exe', 'skype.exe',
    # Screen sharing/remote control (critical)
    'zoom.exe', 'anydesk.exe', 'teamviewer.exe', 'ultraviewer.exe', 'chrome-remote-desktop.exe',
    # Recording/streaming (high priority)
    'obs.exe', 'obs64.exe', 'streamlabs.exe', 'xsplit.exe', 'camtasia.exe',
    # Development tools that could aid cheating
    'postman.exe', 'insomnia.exe', 'fiddler.exe', 'wireshark.exe',
    # Browsers (configurable - may be allowed in some contexts)
    'chrome.exe', 'firefox.exe', 'msedge.exe', 'opera.exe', 'brave.exe',

    # Unix/Linux/macOS equivalents (without .exe)
    'cluely', 'fuckleetcode', 'chatgpt', 'copilot', 'codeium', 'tabnine', 'stackoverflow',
    'discord', 'slack', 'teams', 'whatsapp', 'telegram', 'skype',
    'zoom', 'anydesk', 'teamviewer', 'ultraviewer',
    'obs', 'streamlabs', 'xsplit', 'camtasia',
    'postman', 'insomnia', 'fiddler', 'wireshark',
    'chrome', 'firefox', 'edge', 'opera', 'brave',
]

# Severity levels for different violation types
VIOLATION_SEVERITY = {
    # Windows .exe format
    'cluely.exe': 'critical',
    'fuckleetcode.exe': 'critical',
    'chatgpt.exe': 'critical',
    'copilot.exe': 'critical',
    'stackoverflow.exe': 'critical',
    'discord.exe': 'high',
    'slack.exe': 'high',
    'teams.exe': 'high',
    'zoom.exe': 'high',
    'anydesk.exe': 'critical',
    'teamviewer.exe': 'critical',
    'obs.exe': 'high',
    'chrome.exe': 'medium',
    'firefox.exe': 'medium',
    'msedge.exe': 'medium',

    # Unix/Linux/macOS format (without .exe)
    'cluely': 'critical',
    'fuckleetcode': 'critical',
    'chatgpt': 'critical',
    'copilot': 'critical',
    'stackoverflow': 'critical',
    'discord': 'high',
    'slack': 'high',
    'teams': 'high',
    'zoom': 'high',
    'anydesk': 'critical',
    'teamviewer': 'critical',
    'obs': 'high',
    'chrome': 'medium',
    'firefox': 'medium',
    'edge': 'medium',
}

def list_processes() -> Set[str]:
    """Enumerate running process names in lowercase (normalized with .exe on Windows).

    Primary method uses psutil for reliability. Fallbacks only if psutil unavailable.
    Returns a set of process names (e.g., 'discord.exe').
    """
    processes: Set[str] = set()
    system = platform.system().lower()

    # Preferred: psutil
    if psutil is not None:
        for proc in psutil.process_iter(['name']):
            try:
                name = proc.info.get('name')
                if not name:
                    continue
                name_l = name.lower()
                if system == 'windows' and not name_l.endswith('.exe'):
                    name_l += '.exe'
                processes.add(name_l)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
        return processes

    # Fallback legacy methods (only if psutil missing)
    try:
        if system == 'windows':
            try:
                result = subprocess.run(['tasklist', '/fo', 'csv'], capture_output=True, text=True, timeout=5)
                if result.returncode == 0 and result.stdout:
                    lines = result.stdout.strip().split('\n')[1:]
                    for line in lines:
                        if line.strip():
                            raw = line.split(',')[0].strip('"').lower()
                            if not raw.endswith('.exe'):
                                raw += '.exe'
                            processes.add(raw)
            except Exception:
                pass
        else:
            result = subprocess.run(['ps', 'ax', '-o', 'comm'], capture_output=True, text=True, timeout=5)
            if result.returncode == 0 and result.stdout:
                for ln in result.stdout.splitlines()[1:]:
                    if ln.strip():
                        name = ln.strip().split('/')[-1].lower()
                        processes.add(name)
    except Exception:
        pass

    return processes


def scan() -> Dict:
    """Perform a scan using exact matching (default) or optional fuzzy mode.

    Fuzzy mode (opt-in via ANTI_CHEAT_FUZZY=1) allows substring containment to catch
    variant process names but increases false positive risk.
    """
    names = list_processes()
    fuzzy = os.getenv('ANTI_CHEAT_FUZZY', '0') in ('1', 'true', 'yes')

    # Normalize banned list with platform adjustments
    system = platform.system().lower()
    banned_norm: List[str] = []
    for b in BANNED:
        if system == 'windows':
            if not b.endswith('.exe'):
                b = f"{b}.exe"
        else:
            if b.endswith('.exe'):
                b = b[:-4]
        banned_norm.append(b.lower())

    banned_found: List[str] = []
    high_severity_violations: List[str] = []
    critical_violations: List[str] = []

    name_set = set(names)

    for banned_app in banned_norm:
        # Exact match fast path
        if banned_app in name_set:
            banned_found.append(banned_app)
        elif fuzzy:
            # Substring fuzzy check (guard length > 3 to avoid trivial tokens)
            if len(banned_app) > 3:
                for running in name_set:
                    if banned_app in running:
                        banned_found.append(banned_app)
                        break

    # Classify severities
    for app in banned_found:
        # Map back to severity key variants (with or without .exe)
        key = app
        if key not in VIOLATION_SEVERITY and key.endswith('.exe'):
            key = key[:-4]
        severity = VIOLATION_SEVERITY.get(key, 'medium')
        if severity == 'critical':
            critical_violations.append(app)
        elif severity == 'high':
            high_severity_violations.append(app)

    # Threat level
    if critical_violations:
        threat_level = 'critical'
    elif high_severity_violations:
        threat_level = 'high'
    elif banned_found:
        threat_level = 'medium'
    else:
        threat_level = 'none'

    # Terminate for any detected violations (critical, high, or medium)
    should_terminate = bool(critical_violations or high_severity_violations or banned_found)

    return {
        'platform': system,
        'process_count': len(names),
        'banned': sorted(set(banned_found)),
        'critical_violations': sorted(set(critical_violations)),
        'high_severity_violations': sorted(set(high_severity_violations)),
        'threat_level': threat_level,
        'count': len(set(banned_found)),
        'timestamp': time.time(),
        'fuzzy_mode': fuzzy,
        'should_terminate': should_terminate,
    }


def main():
    start = time.time()
    result = scan()
    result['elapsed_ms'] = int((time.time() - start) * 1000)
    # Emit human-readable debug line BEFORE JSON (Electron side should parse last JSON line)
    debug_line = (
        f"[AntiCheat] scanned={result['process_count']} banned={result['count']} "
        f"critical={len(result['critical_violations'])} high={len(result['high_severity_violations'])} "
        f"threat={result['threat_level']} fuzzy={result['fuzzy_mode']} elapsed_ms={result['elapsed_ms']}"
    )
    print(debug_line, file=sys.stderr)
    print(json.dumps(result))


if __name__ == '__main__':
    main()
