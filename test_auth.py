import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.models.user import User
from backend.utils.security_utils import SecurityUtils
import sqlite3

print("Testing authentication system...")

# Test database connection
db_path = os.path.join(os.path.dirname(__file__), 'backend', 'codevail.db')
print(f"Database path: {db_path}")
print(f"Database exists: {os.path.exists(db_path)}")

# Check users in database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT username, password_hash, role FROM users")
users = cursor.fetchall()
print(f"\nUsers in database:")
for user in users:
    print(f"  Username: {user[0]}, Role: {user[2]}")
    print(f"  Password hash: {user[1][:50]}...")

# Test password verification
test_username = "candidate@codevail.com"
test_password = "candidate123"

print(f"\nTesting authentication for {test_username} with password '{test_password}'")

# Get user from database
cursor.execute("SELECT * FROM users WHERE username=? OR email=?", (test_username, test_username))
user_row = cursor.fetchone()

if user_row:
    print(f"User found: {user_row[1]} (email: {user_row[2]})")
    stored_hash = user_row[3]
    print(f"Stored hash: {stored_hash}")
    
    # Test password verification
    is_valid = SecurityUtils.verify_password(test_password, stored_hash)
    print(f"Password verification result: {is_valid}")
    
    # Test our authentication function
    auth_result = User.authenticate_user(test_username, test_password)
    print(f"Authentication result: {auth_result}")
else:
    print("User not found in database")

conn.close()
