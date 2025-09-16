from flask import Blueprint, request, jsonify
from utils.security_utils import require_auth
import sqlite3
import datetime
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'users.db')

def _ensure_tables():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS proctor_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        event_type TEXT,
        detail TEXT,
        ts TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS webcam_chunks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        ts TEXT,
        mime TEXT,
        data BLOB
    )''')
    conn.commit()
    conn.close()

proctor_bp = Blueprint('proctor', __name__)

@proctor_bp.route('/proctor/event', methods=['POST'])
@require_auth
def proctor_event():
    _ensure_tables()
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    event_type = data.get('type')  # focus_blur, clipboard, overlay, app_list, etc.
    detail = data.get('detail')
    if not username or not event_type:
        return jsonify({'error': 'Missing fields'}), 400
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO proctor_events (username, event_type, detail, ts) VALUES (?,?,?,?)',
              (username, event_type, str(detail), datetime.datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})

@proctor_bp.route('/proctor/webcam', methods=['POST'])
@require_auth
def proctor_webcam():
    _ensure_tables()
    username = request.form.get('username')
    mime = request.form.get('mime', 'video/webm')
    file = request.files.get('chunk')
    if not username or not file:
        return jsonify({'error': 'Missing fields'}), 400
    blob = file.read()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('INSERT INTO webcam_chunks (username, ts, mime, data) VALUES (?,?,?,?)',
              (username, datetime.datetime.utcnow().isoformat(), mime, blob))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})
