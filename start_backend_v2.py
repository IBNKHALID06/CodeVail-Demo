#!/usr/bin/env python3
"""
CodeVail Backend Launcher
"""
import subprocess
import sys
import os

def main():
    # Get the backend directory path
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
    app_path = os.path.join(backend_dir, 'app.py')
    
    print("🚀 Starting CodeVail Backend Server...")
    print(f"📁 Backend Directory: {backend_dir}")
    print(f"🔗 Server will run on: http://localhost:5000")
    print("=" * 50)
    
    # Set environment variables
    env = os.environ.copy()
    env['PYTHONPATH'] = backend_dir
    env['FLASK_ENV'] = 'development'
    
    try:
        # Start the Flask app as a subprocess
        cmd = [sys.executable, app_path]
        process = subprocess.Popen(
            cmd,
            cwd=backend_dir,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        # Print output in real-time
        for line in process.stdout:
            print(line.rstrip())
            
        process.wait()
        
    except KeyboardInterrupt:
        print("\n🛑 Shutting down backend server...")
        process.terminate()
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

if __name__ == "__main__":
    main()
