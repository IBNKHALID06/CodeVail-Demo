#!/usr/bin/env python3
"""
Test authentication system to identify the exact issue
"""
import os
import sys
import sqlite3
import hashlib

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

from backend.utils.security_utils import SecurityUtils

def test_authentication():
    print("🔍 CodeVail Authentication Test")
    print("=" * 40)
    
    # 1. Check database file
    db_path = os.path.join(backend_path, 'codevail.db')
    print(f"Database path: {db_path}")
    print(f"Database exists: {os.path.exists(db_path)}")
    
    if not os.path.exists(db_path):
        print("❌ Database file not found!")
        return False
    
    # 2. Check database contents
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"Users in database: {user_count}")
        
        cursor.execute("SELECT username, password_hash, role FROM users")
        users = cursor.fetchall()
        
        print("\nUsers found:")
        for user in users:
            print(f"  - {user[0]} ({user[2]}) - Hash: {user[1][:20]}...")
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False
    
    # 3. Test password hashing
    test_password = "Candidate123"
    print(f"\nTesting password: '{test_password}'")
    
    # Check password strength
    is_valid, msg = SecurityUtils.validate_password_strength(test_password)
    print(f"Password validation: {is_valid} - {msg}")
    
    if not is_valid:
        print("❌ Test password doesn't meet strength requirements!")
        return False
    
    # Hash the password
    hashed = SecurityUtils.hash_password(test_password)
    print(f"Generated hash: {hashed}")
    
    # 4. Test authentication for candidate
    test_user = "candidate@codevail.com"
    print(f"\nTesting authentication for: {test_user}")
    
    cursor.execute("SELECT * FROM users WHERE username=? OR email=?", (test_user, test_user))
    user_row = cursor.fetchone()
    
    if user_row:
        print(f"User found: {user_row[1]} (email: {user_row[2]})")
        stored_hash = user_row[3]
        print(f"Stored hash: {stored_hash}")
        print(f"Generated hash: {hashed}")
        print(f"Hashes match: {stored_hash == hashed}")
        
        # Test verification function
        verification = SecurityUtils.verify_password(test_password, stored_hash)
        print(f"Verification result: {verification}")
        
        if verification:
            print("✅ Authentication test PASSED!")
            return True
        else:
            print("❌ Authentication test FAILED!")
            return False
    else:
        print("❌ User not found in database!")
        return False
    
    conn.close()

if __name__ == "__main__":
    success = test_authentication()
    print("\n" + "=" * 40)
    if success:
        print("🎉 Authentication system is working correctly!")
    else:
        print("🚨 Authentication system has issues!")
