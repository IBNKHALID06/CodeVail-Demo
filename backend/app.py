from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
import os
import sys
import sqlite3
from datetime import datetime, timedelta

# Ensure backend directory itself is on path (so 'controllers' resolves to backend/controllers)
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Change working directory to backend
os.chdir(backend_dir)

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(project_root, '.env'))

# Import controllers
try:
    from controllers.grading_controller import grading_bp
    from controllers.auth_controller import auth_bp
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    raise

# Production configuration class
class ProductionConfig:
    SECRET_KEY = os.getenv('SECRET_KEY', 'codevail-production-key-change-this')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',')
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///users.db')
    PORT = int(os.getenv('BACKEND_PORT', 5000))
    HOST = os.getenv('BACKEND_HOST', '0.0.0.0')
    DEBUG = os.getenv('FLASK_ENV', 'production') == 'development'

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load production configuration
    config = ProductionConfig()
    app.config['SECRET_KEY'] = config.SECRET_KEY
    
    # Secure CORS configuration
    CORS(
        app,
        origins=config.CORS_ORIGINS,
        allow_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        supports_credentials=True
    )

    socketio = SocketIO(
        app, 
        cors_allowed_origins=config.CORS_ORIGINS,
        async_mode="threading"
    )
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(grading_bp, url_prefix='/api/grading')
    
    return app, socketio

app, socketio = create_app()

# --- In-memory meeting store (ephemeral) ---
# Structure: MEETINGS[code] = { 'host': str, 'createdAt': int(ms), 'active': bool, 'expiresAt': int(ms) }
# PARTICIPANTS[code] = { sid: { 'username': str, 'role': str } }
MEETINGS = {}
PARTICIPANTS = {}

def _now_ms():
    import time
    return int(time.time() * 1000)

def _gen_code(n=8):
    import random, string
    alphabet = ''.join([c for c in (string.ascii_uppercase + string.digits) if c not in 'O0I1l'])
    return ''.join(random.choice(alphabet) for _ in range(n))

def _is_meeting_active(code):
    m = MEETINGS.get(code)
    if not m:
        return False
    if not m.get('active'):
        return False
    exp = m.get('expiresAt')
    return exp is None or exp > _now_ms()

# Simple request logger for debugging connectivity
@app.before_request
def log_request_info():
    try:
        print(f"[REQ] {request.method} {request.path} from {request.remote_addr}")
        if request.method in ('POST', 'PUT', 'PATCH'):
            print(f"[REQ] Headers: {dict(request.headers)}")
            data = request.get_json(silent=True)
            if data is not None:
                print(f"[REQ] JSON: {data}")
    except Exception as e:
        print(f"[REQ] log error: {e}")

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({'message': 'CodeVail Backend API', 'status': 'running'})

# Dashboard API endpoints
@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    """Get user profile data"""
    # Mock user data - replace with real database lookup
    return jsonify({
        'username': 'sdfsdf',
        'role': 'Candidate',
        'email': 'sdfsdf@example.com',
        'avatar': None,
        'joinedDate': '2024-01-15'
    })

@app.route('/api/user/interviews', methods=['GET'])
def get_user_interviews():
    """Get upcoming interviews for user"""
    return jsonify({
        'upcoming': [
            {
                'id': 1,
                'title': 'Frontend Developer Interview',
                'interviewer': 'John Smith',
                'scheduledTime': '2025-09-05T14:30:00Z',
                'duration': 60,
                'meetingCode': 'ABC-123',
                'status': 'scheduled'
            }
        ],
        'past': [
            {
                'id': 2,
                'title': 'Technical Screening',
                'interviewer': 'Jane Doe',
                'scheduledTime': '2025-08-28T10:00:00Z',
                'duration': 45,
                'status': 'completed',
                'score': 85
            }
        ]
    })

@app.route('/api/user/tests', methods=['GET'])
def get_user_tests():
    """Get test results and statistics"""
    return jsonify({
        'totalTests': 8,
        'averageScore': 82,
        'passRate': 87.5,
        'recentTests': [
            {
                'id': 1,
                'name': 'JavaScript Fundamentals',
                'score': 88,
                'completedAt': '2025-08-30T15:30:00Z',
                'status': 'passed'
            },
            {
                'id': 2,
                'name': 'React Components',
                'score': 92,
                'completedAt': '2025-08-25T11:15:00Z',
                'status': 'passed'
            }
        ]
    })

@app.route('/api/meetings/validate', methods=['POST'])
def validate_meeting_code():
    """Validate meeting code and return meeting info"""
    data = request.get_json()
    code = data.get('code', '').strip().upper()
    
    if not code or len(code) != 6 or not code.replace('-', '').isalnum():
        return jsonify({'valid': False, 'error': 'Invalid meeting code format'}), 400
    
    # Check if meeting exists and is active
    meeting = MEETINGS.get(code)
    if meeting and _is_meeting_active(code):
        return jsonify({
            'valid': True,
            'meeting': {
                'code': code,
                'host': meeting['host'],
                'active': True
            }
        })
    
    return jsonify({'valid': False, 'error': 'Meeting not found or inactive'}), 404

@app.route('/api/schedule/interview', methods=['POST'])
def schedule_interview():
    """Schedule a new interview"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['interviewerEmail', 'candidateEmail', 'scheduledTime', 'duration']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Mock scheduling - in real implementation, save to database
    interview_id = len(MEETINGS) + 100
    
    return jsonify({
        'success': True,
        'interviewId': interview_id,
        'scheduledTime': data['scheduledTime'],
        'meetingCode': _gen_code(6),
        'message': 'Interview scheduled successfully'
    })

# Remove blueprint registrations that cause import errors
# Register blueprints
# app.register_blueprint(code_controller.code_bp)
# app.register_blueprint(auth_controller.auth_bp)
# app.register_blueprint(test_controller.test_bp)
# app.register_blueprint(schedule_controller.schedule_bp)
# app.register_blueprint(review_controller.review_bp)
# app.register_blueprint(proctor_controller.proctor_bp)

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'version': '1.0.0', 'mockMode': False})

@app.route('/api/health', methods=['GET'])
def api_health():
    return jsonify({'status': 'ok', 'version': '1.0.0', 'mockMode': False})

# --- Meetings (Zoom/Meet-like codes) ---
@app.route('/meetings', methods=['POST'])
def create_meeting():
    try:
        data = request.get_json(silent=True) or {}
        host = data.get('host') or 'host'
        duration_minutes = int(data.get('duration', 240))  # default 4 hours
        code = _gen_code(6)
        # ensure uniqueness
        while code in MEETINGS:
            code = _gen_code(6)
        now = _now_ms()
        expires_at = now + max(1, duration_minutes) * 60 * 1000
        MEETINGS[code] = {'host': host, 'createdAt': now, 'active': True, 'expiresAt': expires_at}
        PARTICIPANTS[code] = {}
        return jsonify({'code': code, 'host': host, 'createdAt': now, 'expiresAt': expires_at, 'active': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/meetings/<code>', methods=['GET'])
def get_meeting(code):
    m = MEETINGS.get(code)
    if not m:
        return jsonify({'exists': False, 'active': False}), 404
    return jsonify({'exists': True, 'active': _is_meeting_active(code), **m})

@app.route('/meetings/<code>/end', methods=['POST'])
def end_meeting(code):
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    m = MEETINGS.get(code)
    if not m:
        return jsonify({'error': 'not_found'}), 404
    if username and m.get('host') and username != m['host']:
        return jsonify({'error': 'forbidden'}), 403
    m['active'] = False
    # notify participants room closed
    socketio.emit('meeting-ended', {'code': code}, to=code)
    return jsonify({'ok': True})

# --- Socket.IO signaling for calls ---
@socketio.on('join')
def on_join(data):
    room = data.get('room')  # meeting code
    username = data.get('username')
    role = data.get('role')
    if not room:
        emit('meeting-error', {'error': 'missing_code'})
        return
    m = MEETINGS.get(room)
    if not m or not _is_meeting_active(room):
        emit('meeting-error', {'error': 'invalid_or_inactive'})
        return
    # track participant by sid
    if room not in PARTICIPANTS:
        PARTICIPANTS[room] = {}
    PARTICIPANTS[room][request.sid] = {'username': username, 'role': role}
    join_room(room)
    emit('peer-joined', {'username': username}, to=room, include_self=False)

@socketio.on('leave')
def on_leave(data):
    room = data.get('room')
    username = data.get('username')
    if room:
        leave_room(room)
        emit('peer-left', {'username': username}, to=room, include_self=False)
        # remove from participants
        try:
            if room in PARTICIPANTS and request.sid in PARTICIPANTS[room]:
                del PARTICIPANTS[room][request.sid]
        except Exception:
            pass

@socketio.on('disconnect')
def on_disconnect():
    # cleanup sid from all rooms
    try:
        for code, members in list(PARTICIPANTS.items()):
            if request.sid in members:
                username = members[request.sid].get('username')
                del members[request.sid]
                emit('peer-left', {'username': username}, to=code, include_self=False)
    except Exception:
        pass

@socketio.on('offer')
def on_offer(data):
    room = data.get('room')
    if not room:
        emit('meeting-error', {'error': 'missing_code'})
        return
    # Only host can initiate offer
    m = MEETINGS.get(room)
    if not m or not _is_meeting_active(room):
        emit('meeting-error', {'error': 'invalid_or_inactive'})
        return
    # find sender role by sid
    sender = PARTICIPANTS.get(room, {}).get(request.sid)
    if not sender:
        emit('meeting-error', {'error': 'not_in_room'})
        return
    if sender.get('username') != m.get('host'):
        emit('meeting-error', {'error': 'only_host_can_start'})
        return
    emit('offer', data, to=room, include_self=False)

@socketio.on('answer')
def on_answer(data):
    room = data.get('room')
    emit('answer', data, to=room, include_self=False)

@socketio.on('ice-candidate')
def on_ice_candidate(data):
    room = data.get('room')
    emit('ice-candidate', data, to=room, include_self=False)

@socketio.on('chat-message')
def on_chat_message(data):
    room = data.get('room')
    msg = {
        'username': data.get('username'),
        'message': data.get('message'),
        'ts': data.get('ts') or _now_ms(),
    }
    if not room or room not in MEETINGS or not _is_meeting_active(room):
        emit('meeting-error', {'error': 'invalid_or_inactive'})
        return
    emit('chat-message', msg, to=room)

@socketio.on('participants-request')
def on_participants_request(data):
    room = data.get('room')
    if not room:
        return
    members = PARTICIPANTS.get(room, {})
    payload = [{'username': v.get('username'), 'role': v.get('role')} for v in members.values()]
    # emit only to requester
    emit('participants', {'list': payload})

if __name__ == '__main__':
    # Production startup
    config = ProductionConfig()
    print(f"🚀 Starting CodeVail Backend Server...")
    print(f"🔗 Server URL: http://{config.HOST}:{config.PORT}")
    print(f"🛡️  CORS Origins: {', '.join(config.CORS_ORIGINS)}")
    print(f"📊 Debug Mode: True (Override for debugging)")  # Enable debug
    print("=" * 50)
    
    try:
        # Use socketio.run to support WebSocket
        socketio.run(
            app, 
            host=config.HOST, 
            port=config.PORT, 
            debug=True,  # Enable debug mode
            use_reloader=False, 
            allow_unsafe_werkzeug=True
        )
    except Exception as e:
        print(f"❌ Server startup error: {e}")
        import traceback
        traceback.print_exc()
