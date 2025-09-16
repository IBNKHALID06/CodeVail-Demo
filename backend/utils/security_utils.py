import hashlib
import jwt
import re
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from typing import Optional, Tuple

class SecurityUtils:
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using SHA-256 (temporary until bcrypt is fixed)"""
        salt = "codevail_salt_2025"  # In production, use proper salting
        return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify a password against its hash"""
        try:
            return SecurityUtils.hash_password(password) == hashed
        except Exception:
            return False
    
    @staticmethod
    def validate_password_strength(password: str) -> Tuple[bool, str]:
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"
        
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"
        
        if not re.search(r"\d", password):
            return False, "Password must contain at least one digit"
        
        return True, "Password is strong"
    
    @staticmethod
    def validate_username(username: str) -> Tuple[bool, str]:
        """Validate username format"""
        if not username or len(username) < 3:
            return False, "Username must be at least 3 characters long"
        
        if len(username) > 50:
            return False, "Username must be less than 50 characters"
        
        if not re.match(r"^[a-zA-Z0-9_-]+$", username):
            return False, "Username can only contain letters, numbers, hyphens, and underscores"
        
        return True, "Username is valid"
    
    @staticmethod
    def generate_jwt_token(username: str, role: str, secret_key: str) -> str:
        """Generate a JWT token"""
        payload = {
            'username': username,
            'role': role,
            'exp': datetime.utcnow() + current_app.config['JWT_EXPIRATION_DELTA'],
            'iat': datetime.utcnow(),
            'sub': username
        }
        return jwt.encode(payload, secret_key, algorithm=current_app.config['JWT_ALGORITHM'])
    
    @staticmethod
    def verify_jwt_token(token: str, secret_key: str) -> Optional[dict]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, secret_key, algorithms=[current_app.config['JWT_ALGORITHM']])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def sanitize_input(input_str: str) -> str:
        """Basic input sanitization"""
        if not input_str:
            return ""
        
        # Remove potential SQL injection characters and limit length
        sanitized = re.sub(r'[<>"\';()&+]', '', str(input_str))
        return sanitized[:255]  # Limit length

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid authorization header format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            payload = SecurityUtils.verify_jwt_token(token, current_app.config['SECRET_KEY'])
            if not payload:
                return jsonify({'error': 'Token is invalid or expired'}), 401
            
            # Add user info to request context
            request.current_user = {
                'username': payload['username'],
                'role': payload['role']
            }
            
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_role(required_role: str):
    """Decorator to require specific role"""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(*args, **kwargs):
            if request.current_user['role'] != required_role:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
