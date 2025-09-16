import sys
import os
backend_services_path = os.path.join(os.path.dirname(__file__), 'backend', 'services')
if backend_services_path not in sys.path:
    sys.path.insert(0, backend_services_path)

# Dynamically load anti_cheat to avoid unresolved import issues in some environments
import importlib.util
anti_cheat_path = os.path.join(backend_services_path, 'anti_cheat.py')
if not os.path.isfile(anti_cheat_path):
    raise ImportError(f"anti_cheat.py not found at {anti_cheat_path}.")
spec = importlib.util.spec_from_file_location("anti_cheat", anti_cheat_path)
if spec is None or spec.loader is None:
    raise ImportError(f"Could not create spec for anti_cheat at {anti_cheat_path}.")
_anti_cheat = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_anti_cheat)

# Use the actual scan function from anti_cheat.py
scan = _anti_cheat.scan

# Test with real running processes
def test_discord_detection():
    print("=== Testing Discord Detection (Live) ===")
    
    # Run actual scan on current system
    result = scan()
    print(f"Live scan results:")
    print(f"  Banned: {result['banned']}")
    print(f"  Critical: {result['critical_violations']}")  
    print(f"  High: {result['high_severity_violations']}")
    print(f"  Threat: {result['threat_level']}")
    print(f"  Should terminate: {result['should_terminate']}")
    print(f"  Process count: {result['process_count']}")
    print()
    
    # Check if Discord is specifically detected
    discord_found = any('discord' in proc.lower() for proc in result['banned'])
    print(f"Discord detected in banned list: {discord_found}")
    
    if discord_found:
        print("✅ Discord IS being detected")
        if result['should_terminate']:
            print("✅ Should terminate = True (termination should happen)")
        else:
            print("❌ Should terminate = False (termination blocked)")
    else:
        print("❌ Discord NOT detected - check if Discord is actually running")
        
if __name__ == '__main__':
    test_discord_detection()