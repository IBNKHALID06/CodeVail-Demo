from flask import Blueprint, request, jsonify, current_app
from models.user import User
from utils.security_utils import SecurityUtils, require_auth
from utils.rate_limiter import rate_limit, key_by_ip, key_by_user_or_ip
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@rate_limit(key_by_ip, limit=10, window_sec=60)
def register():
    """Register a new user with rate limiting"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        username = SecurityUtils.sanitize_input(data.get('username', ''))
        password = data.get('password', '')
        role = SecurityUtils.sanitize_input(data.get('role', ''))
        
        if not all([username, password, role]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate role
        if role not in ['Candidate', 'Interviewer', 'Admin']:
            return jsonify({'error': 'Invalid role'}), 400
        
        User.create_table()
        success, message = User.add_user(username, password, role)
        
        if success:
            logger.info(f"User registered successfully: {username}")
            return jsonify({'message': message}), 201
        else:
            logger.warning(f"Registration failed for {username}: {message}")
            return jsonify({'error': message}), 409
            
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@rate_limit(key_by_user_or_ip, limit=10, window_sec=60)
def login():
    """Login with rate limiting and secure authentication"""
    if request.method == 'OPTIONS':
        return ('', 204)
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        username = SecurityUtils.sanitize_input(data.get('username', ''))
        password = data.get('password', '')
        
        if not all([username, password]):
            return jsonify({'error': 'Missing username or password'}), 400
        
        # Authenticate user
        user = User.authenticate_user(username, password)
        
        if user:
            logger.info(f"Successful login for user: {username}")
            
            # Generate JWT token
            token = SecurityUtils.generate_jwt_token(
                username=user['username'],
                role=user['role'],
                secret_key=current_app.config['SECRET_KEY']
            )
            
            return jsonify({
                'token': token,
                'user': {
                    'username': user['username'],
                    'role': user['role']
                }
            }), 200
        else:
            logger.warning(f"Failed login attempt for user: {username}")
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Authentication failed'}), 500

@auth_bp.route('/verify-token', methods=['POST'])
@require_auth
def verify_token():
    """Verify if a token is still valid"""
    return jsonify({
        'valid': True,
        'user': request.current_user
    }), 200

@auth_bp.route('/change-password', methods=['POST'])
@require_auth
def change_password():
    """Allow users to change their password"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not all([current_password, new_password]):
            return jsonify({'error': 'Missing password fields'}), 400
        
        # Validate new password strength
        password_valid, password_msg = SecurityUtils.validate_password_strength(new_password)
        if not password_valid:
            return jsonify({'error': password_msg}), 400
        
        # Verify current password
        user = User.authenticate_user(request.current_user['username'], current_password)
        if not user:
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        success = User.update_password(request.current_user['username'], new_password)
        if success:
            logger.info(f"Password changed for user: {request.current_user['username']}")
            return jsonify({'message': 'Password updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update password'}), 500
            
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        return jsonify({'error': 'Password change failed'}), 500

# Remove the insecure debug endpoint
# The debug endpoint has been removed for security reasons
