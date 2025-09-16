#!/usr/bin/env python3
"""
CodeVail Development Startup Script
Starts both frontend and backend servers for development
"""
import subprocess
import sys
import os
import time
from pathlib import Path

def start_dev_servers():
    """Start development servers"""
    project_root = Path(__file__).parent
    
    print("🛠️  CodeVail Development Environment")
    print("=" * 40)
    
    # Start backend
    print("🚀 Starting Backend Server (Development)...")
    backend_dir = project_root / "backend"
    app_path = backend_dir / "app.py"
    
    env = os.environ.copy()
    env['PYTHONPATH'] = str(backend_dir)
    env['FLASK_ENV'] = 'development'
    
    backend_process = subprocess.Popen(
        [sys.executable, str(app_path)],
        cwd=str(backend_dir),
        env=env
    )
    
    # Give backend time to start
    time.sleep(3)
    
    # Start frontend in development mode
    print("🚀 Starting Frontend Server (Development)...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(project_root)
    )
    
    print("=" * 40)
    print("🎉 CodeVail Development Environment Ready!")
    print("🌐 Frontend: http://localhost:3000 (with hot reload)")
    print("🔧 Backend: http://localhost:5000 (with debug mode)")
    print("📊 Database: SQLite with sample data")
    print("Press Ctrl+C to stop all servers")
    print("=" * 40)
    
    try:
        # Wait for processes
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down development servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Development environment stopped")

if __name__ == "__main__":
    start_dev_servers()
