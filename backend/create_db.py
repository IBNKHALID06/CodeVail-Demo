import sqlite3
import hashlib
import os
import sys

# Add backend directory to path to import SecurityUtils
sys.path.append(os.path.dirname(__file__))
from utils.security_utils import SecurityUtils

def create_database():
    """Create the database and users table with sample data"""
    
    # Create database file path
    db_path = os.path.join(os.path.dirname(__file__), 'codevail.db')
    
    # Connect to database (creates file if doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
    ''')
    
    # Hash function for passwords using SecurityUtils
    def hash_password(password):
        return SecurityUtils.hash_password(password)
    
    # Insert sample users with strong passwords
    sample_users = [
        ('candidate@codevail.com', 'candidate@codevail.com', hash_password('Candidate123'), 'Candidate'),
        ('admin@codevail.com', 'admin@codevail.com', hash_password('Admin123'), 'Interviewer'),
        ('interviewer@codevail.com', 'interviewer@codevail.com', hash_password('Interviewer123'), 'Interviewer'),
        ('test@codevail.com', 'test@codevail.com', hash_password('Test123'), 'Candidate')
    ]
    
    for username, email, password_hash, role in sample_users:
        try:
            cursor.execute('''
                INSERT OR IGNORE INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            ''', (username, email, password_hash, role))
            print(f"Added user: {username} with role: {role}")
        except sqlite3.IntegrityError:
            print(f"User {username} already exists")
    
    # Commit changes
    conn.commit()
    
    # Verify table creation and data
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    print(f"\nDatabase created successfully!")
    print(f"Total users in database: {user_count}")
    
    # Show all users
    cursor.execute("SELECT username, role FROM users")
    users = cursor.fetchall()
    print("\nUsers in database:")
    for username, role in users:
        print(f"  - {username} ({role})")
    
    # Close connection
    conn.close()
    print(f"\nDatabase file created at: {db_path}")

if __name__ == "__main__":
    create_database()
