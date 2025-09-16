import sqlite3
import os
from utils.security_utils import SecurityUtils

# Use absolute path to backend directory codevail.db
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'codevail.db')

class User:
    def __init__(self, username, password, role):
        self.username = username
        self.password = password
        self.role = role

    @staticmethod
    def create_table():
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )''')
        conn.commit()
        conn.close()

    @staticmethod
    def add_user(username, password, role, email=None):
        # Validate input
        username_valid, username_msg = SecurityUtils.validate_username(username)
        if not username_valid:
            return False, username_msg
        
        password_valid, password_msg = SecurityUtils.validate_password_strength(password)
        if not password_valid:
            return False, password_msg
        
        # Use username as email if email not provided
        if email is None:
            email = username
        
        # Hash password before storing
        hashed_password = SecurityUtils.hash_password(password)
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        try:
            c.execute('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', 
                     (username, email, hashed_password, role))
            conn.commit()
            return True, "User created successfully"
        except sqlite3.IntegrityError:
            return False, "Username already exists"
        finally:
            conn.close()

    @staticmethod
    def authenticate_user(username, password):
        """Authenticate user with password verification"""
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE username=? OR email=?', (username, username))
        user = c.fetchone()
        conn.close()
        
        if user and SecurityUtils.verify_password(password, user[3]):  # password_hash is at index 3
            return {
                'id': user[0],
                'username': user[1],
                'email': user[2], 
                'role': user[4]  # role is at index 4
            }
        return None

    @staticmethod
    def get_user(username):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT * FROM users WHERE username=?', (username,))
        user = c.fetchone()
        conn.close()
        return user

    @staticmethod
    def update_password(username, new_password):
        """Update user password with hashing"""
        hashed_password = SecurityUtils.hash_password(new_password)
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        try:
            c.execute('UPDATE users SET password_hash = ? WHERE username = ?', 
                     (hashed_password, username))
            conn.commit()
            return c.rowcount > 0
        except Exception:
            return False
        finally:
            conn.close()

    @staticmethod
    def get_user_count():
        """Get total number of users"""
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT COUNT(*) FROM users')
        count = c.fetchone()[0]
        conn.close()
        return count
