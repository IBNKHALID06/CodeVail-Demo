#!/usr/bin/env python3
"""
CodeVail Production Startup Script
Starts both frontend and backend servers for production
"""
import subprocess
import sys
import os
import time
import signal
import threading
from pathlib import Path

class CodeVailServer:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backend_process = None
        self.frontend_process = None
        
    def start_backend(self):
        """Start the Flask backend server"""
        backend_dir = self.project_root / "backend"
        app_path = backend_dir / "app.py"
        
        print("🚀 Starting Backend Server...")
        
        env = os.environ.copy()
        env['PYTHONPATH'] = str(backend_dir)
        env['FLASK_ENV'] = 'production'
        
        self.backend_process = subprocess.Popen(
            [sys.executable, str(app_path)],
            cwd=str(backend_dir),
            env=env
        )
        print("✅ Backend started on http://localhost:5000")
        
    def start_frontend(self):
        """Start the Next.js frontend server"""
        print("🚀 Starting Frontend Server...")
        
        self.frontend_process = subprocess.Popen(
            ["npm", "run", "start"],
            cwd=str(self.project_root)
        )
        print("✅ Frontend started on http://localhost:3000")
        
    def stop_servers(self):
        """Stop both servers"""
        print("\n🛑 Shutting down servers...")
        
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process.wait()
            print("✅ Backend stopped")
            
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process.wait()
            print("✅ Frontend stopped")
            
    def run(self):
        """Run the production servers"""
        try:
            print("🎯 CodeVail Production Server")
            print("=" * 40)
            
            # Start backend first
            self.start_backend()
            time.sleep(3)  # Give backend time to start
            
            # Build and start frontend
            print("📦 Building frontend for production...")
            subprocess.run(["npm", "run", "build"], cwd=str(self.project_root), check=True)
            
            self.start_frontend()
            
            print("=" * 40)
            print("🎉 CodeVail is running in production mode!")
            print("🌐 Frontend: http://localhost:3000")
            print("🔧 Backend: http://localhost:5000")
            print("Press Ctrl+C to stop all servers")
            print("=" * 40)
            
            # Wait for keyboard interrupt
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
                
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            self.stop_servers()

if __name__ == "__main__":
    server = CodeVailServer()
    server.run()
