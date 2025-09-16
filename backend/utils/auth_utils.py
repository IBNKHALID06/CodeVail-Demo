from flask import request, jsonify, current_app
import jwt
from functools import wraps

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'error': 'Missing token'}), 401
            try:
                token = auth_header.split(' ')[1]
                secret = current_app.config.get('SECRET_KEY')
                payload = jwt.decode(token, secret, algorithms=['HS256'])
                if payload.get('role') not in allowed_roles:
                    return jsonify({'error': 'Forbidden'}), 403
            except Exception as e:
                return jsonify({'error': str(e)}), 401
            return f(*args, **kwargs)
        return wrapper
    return decorator
