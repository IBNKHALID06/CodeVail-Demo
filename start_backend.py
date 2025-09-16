#!/usr/bin/env python3
"""
Simple Flask Backend Starter for CodeVail
"""
import os
import sys

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
sys.path.insert(0, backend_dir)
sys.path.insert(0, project_root)

# Change to backend directory
os.chdir(backend_dir)

# Set environment variables
os.environ['FLASK_ENV'] = 'development'
os.environ['FLASK_APP'] = 'app.py'

print("🚀 Starting CodeVail Backend Server...")
print(f"📁 Backend Directory: {backend_dir}")
print(f"🔗 Server will run on: http://localhost:5000")
print("=" * 50)

try:
    # Import and run the Flask app
    from app import app, socketio
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, use_reloader=False, allow_unsafe_werkzeug=True)
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("Make sure all dependencies are installed: pip install -r requirements.txt")
except Exception as e:
    print(f"❌ Error starting server: {e}")
    sys.exit(1)
