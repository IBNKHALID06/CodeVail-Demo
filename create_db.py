#!/usr/bin/env python3
"""
Create database and populate with sample users
"""
import sqlite3
import hashlib

def create_database():
    """Create the database with users table"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    print("🏗️  Creating database schema...")
    
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'Candidate',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT,
            profile_data TEXT
        )
    """)
    
    # Clear existing users
    cursor.execute("DELETE FROM users")
    
    print("📝 Adding sample users...")
    
    # Hash passwords
    def hash_password(password):
        return hashlib.sha256(password.encode()).hexdigest()
    
    # Sample users
    users = [
        ('candidate@codevail.com', hash_password('candidate123'), 'candidate@codevail.com', 'Candidate'),
        ('admin@codevail.com', hash_password('admin123'), 'admin@codevail.com', 'Interviewer'),
        ('interviewer@codevail.com', hash_password('admin123'), 'interviewer@codevail.com', 'Interviewer'),
    ]
    
    cursor.executemany("""
        INSERT INTO users (username, password, email, role) 
        VALUES (?, ?, ?, ?)
    """, users)
    
    conn.commit()
    
    # Verify users
    cursor.execute("SELECT username, role FROM users")
    created_users = cursor.fetchall()
    
    print("✅ Database created successfully!")
    print("👥 Created users:")
    for user in created_users:
        print(f"   - {user[0]} ({user[1]})")
    
    conn.close()

if __name__ == "__main__":
    create_database()
