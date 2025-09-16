import time
from functools import wraps
from flask import request, jsonify

_WINDOWS = {}

def rate_limit(key_fn, limit: int, window_sec: int):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            key = key_fn()
            now = time.time()
            bucket = _WINDOWS.get(key)
            if not bucket:
                bucket = {'start': now, 'count': 0}
            # reset window
            if now - bucket['start'] > window_sec:
                bucket = {'start': now, 'count': 0}
            bucket['count'] += 1
            _WINDOWS[key] = bucket
            if bucket['count'] > limit:
                retry = max(0, int(bucket['start'] + window_sec - now))
                return jsonify({'error': 'Rate limit exceeded', 'retryAfter': retry}), 429
            return f(*args, **kwargs)
        return wrapper
    return decorator

def key_by_ip():
    return f"ip:{request.remote_addr}"

def key_by_user_or_ip():
    # Prefer username in body if present
    try:
        data = request.get_json(silent=True) or {}
        u = data.get('username')
        if u:
            return f"user:{u}"
    except Exception:
        pass
    return key_by_ip()
