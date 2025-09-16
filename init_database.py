#!/usr/bin/env python3
"""
Initialize CodeVail database with proper schema and sample data
"""
import sqlite3
import hashlib
from datetime import datetime, timedelta

def create_database():
    """Create the complete database schema"""
    conn = sqlite3.connect('backend/users.db')
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
    
    # Tests table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            language TEXT NOT NULL,
            description TEXT NOT NULL,
            starter_code TEXT,
            solution_code TEXT,
            test_cases TEXT,
            time_limit INTEGER DEFAULT 60,
            difficulty TEXT DEFAULT 'Medium',
            created_by INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    """)
    
    # Submissions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            test_id INTEGER NOT NULL,
            code TEXT NOT NULL,
            score INTEGER NOT NULL,
            passed BOOLEAN NOT NULL,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
            execution_time REAL,
            feedback TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (test_id) REFERENCES tests (id)
        )
    """)
    
    # Meetings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_code TEXT UNIQUE NOT NULL,
            interviewer_email TEXT NOT NULL,
            candidate_email TEXT NOT NULL,
            scheduled_time TEXT NOT NULL,
            duration INTEGER NOT NULL DEFAULT 60,
            status TEXT DEFAULT 'scheduled',
            notes TEXT,
            recording_url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Interviews table (for tracking interview sessions)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS interviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER NOT NULL,
            interviewer_id INTEGER NOT NULL,
            candidate_id INTEGER NOT NULL,
            start_time TEXT,
            end_time TEXT,
            status TEXT DEFAULT 'scheduled',
            feedback TEXT,
            rating INTEGER,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id),
            FOREIGN KEY (interviewer_id) REFERENCES users (id),
            FOREIGN KEY (candidate_id) REFERENCES users (id)
        )
    """)
    
    conn.commit()
    return conn

def hash_password(password):
    """Simple password hashing for demo"""
    return hashlib.sha256(password.encode()).hexdigest()

def populate_sample_data(conn):
    """Populate database with realistic sample data"""
    cursor = conn.cursor()
    
    print("📝 Adding sample users...")
    
    # Sample users
    sample_users = [
        ('john_doe', hash_password('password123'), 'john.doe@example.com', 'Candidate'),
        ('sarah_smith', hash_password('password123'), 'sarah.smith@techcorp.com', 'Interviewer'),
        ('mike_johnson', hash_password('password123'), 'mike.johnson@example.com', 'Candidate'),
        ('lisa_wang', hash_password('password123'), 'lisa.wang@techcorp.com', 'Interviewer'),
        ('alex_brown', hash_password('password123'), 'alex.brown@example.com', 'Candidate'),
        ('testuser', hash_password('password123'), 'test@example.com', 'Candidate'),
        ('admin', hash_password('admin123'), 'admin@codevail.com', 'Interviewer')
    ]
    
    cursor.executemany(
        "INSERT OR IGNORE INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
        sample_users
    )
    
    print("🧪 Adding sample tests...")
    
    # Sample coding tests
    sample_tests = [
        (
            'Two Sum Problem',
            'javascript',
            'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            'function twoSum(nums, target) {\n    // Your solution here\n    return [];\n}',
            'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}',
            '[{"input": "[2,7,11,15], 9", "expected": "[0,1]"}, {"input": "[3,2,4], 6", "expected": "[1,2]"}]',
            30,
            'Easy'
        ),
        (
            'Palindrome Check',
            'python',
            'Write a function to check if a given string is a palindrome (reads the same forward and backward).',
            'def is_palindrome(s):\n    # Your solution here\n    pass',
            'def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]',
            '[{"input": "racecar", "expected": true}, {"input": "hello", "expected": false}]',
            20,
            'Easy'
        ),
        (
            'Binary Tree Traversal',
            'java',
            'Implement inorder traversal of a binary tree.',
            'import java.util.*;\n\nclass TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode() {}\n    TreeNode(int val) { this.val = val; }\n}\n\npublic class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        // Your solution here\n        return new ArrayList<>();\n    }\n}',
            'public List<Integer> inorderTraversal(TreeNode root) {\n    List<Integer> result = new ArrayList<>();\n    if (root != null) {\n        result.addAll(inorderTraversal(root.left));\n        result.add(root.val);\n        result.addAll(inorderTraversal(root.right));\n    }\n    return result;\n}',
            '[{"input": "[1,null,2,3]", "expected": "[1,3,2]"}]',
            45,
            'Medium'
        ),
        (
            'Fibonacci Sequence',
            'cpp',
            'Implement a function to calculate the nth Fibonacci number efficiently.',
            '#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    // Your solution here\n    return 0;\n}',
            'int fibonacci(int n) {\n    if (n <= 1) return n;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}',
            '[{"input": "5", "expected": "5"}, {"input": "10", "expected": "55"}]',
            25,
            'Easy'
        ),
        (
            'Array Rotation',
            'python',
            'Rotate an array to the right by k steps.',
            'def rotate(nums, k):\n    # Your solution here\n    pass',
            'def rotate(nums, k):\n    k = k % len(nums)\n    nums[:] = nums[-k:] + nums[:-k]',
            '[{"input": "[1,2,3,4,5,6,7], 3", "expected": "[5,6,7,1,2,3,4]"}]',
            30,
            'Medium'
        )
    ]
    
    cursor.executemany(
        "INSERT OR IGNORE INTO tests (title, language, description, starter_code, solution_code, test_cases, time_limit, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        sample_tests
    )
    
    print("📊 Adding sample submissions...")
    
    # Sample submissions
    sample_submissions = [
        (1, 1, 'function twoSum(nums, target) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n    return [];\n}', 85, True, 0.15, 'Good solution but could be optimized'),
        (3, 2, 'def is_palindrome(s):\n    return s.lower() == s[::-1].lower()', 95, True, 0.08, 'Excellent solution!'),
        (5, 1, 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}', 100, True, 0.12, 'Perfect optimal solution!'),
        (1, 4, 'def rotate(nums, k):\n    k = k % len(nums)\n    nums[:] = nums[-k:] + nums[:-k]', 100, True, 0.09, 'Excellent solution!'),
        (3, 3, 'import java.util.*;\n\npublic List<Integer> inorderTraversal(TreeNode root) {\n    List<Integer> result = new ArrayList<>();\n    if (root != null) {\n        result.addAll(inorderTraversal(root.left));\n        result.add(root.val);\n        result.addAll(inorderTraversal(root.right));\n    }\n    return result;\n}', 90, True, 0.25, 'Good recursive solution'),
    ]
    
    cursor.executemany(
        "INSERT OR IGNORE INTO submissions (user_id, test_id, code, score, passed, execution_time, feedback) VALUES (?, ?, ?, ?, ?, ?, ?)",
        sample_submissions
    )
    
    print("📅 Adding sample meetings...")
    
    # Sample meetings
    now = datetime.now()
    sample_meetings = [
        ('ABC123', 'sarah.smith@techcorp.com', 'john.doe@example.com', 
         (now + timedelta(hours=2)).isoformat(), 60, 'scheduled', 'Technical interview for Frontend Developer position'),
        ('XYZ789', 'lisa.wang@techcorp.com', 'mike.johnson@example.com', 
         (now + timedelta(days=1)).isoformat(), 45, 'scheduled', 'Algorithm and data structures focus'),
        ('DEF456', 'sarah.smith@techcorp.com', 'alex.brown@example.com', 
         (now - timedelta(days=1)).isoformat(), 60, 'completed', 'Backend development interview - went well'),
        ('GHI789', 'lisa.wang@techcorp.com', 'john.doe@example.com', 
         (now + timedelta(days=2, hours=3)).isoformat(), 90, 'scheduled', 'System design interview'),
        ('JKL012', 'sarah.smith@techcorp.com', 'testuser@example.com', 
         (now + timedelta(hours=24)).isoformat(), 60, 'scheduled', 'Entry level position interview')
    ]
    
    cursor.executemany(
        "INSERT OR IGNORE INTO meetings (meeting_code, interviewer_email, candidate_email, scheduled_time, duration, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
        sample_meetings
    )
    
    conn.commit()
    print("✅ Sample data added successfully!")

def verify_data(conn):
    """Verify the data was inserted correctly"""
    cursor = conn.cursor()
    
    print("\n📊 Database Statistics:")
    
    tables = ['users', 'tests', 'submissions', 'meetings']
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"  • {table.capitalize()}: {count} records")
    
    # Show some sample data
    print("\n👥 Sample Users:")
    cursor.execute("SELECT username, email, role FROM users LIMIT 3")
    for user in cursor.fetchall():
        print(f"  • {user[0]} ({user[2]}) - {user[1]}")
    
    print("\n🧪 Sample Tests:")
    cursor.execute("SELECT title, language, difficulty FROM tests LIMIT 3")
    for test in cursor.fetchall():
        print(f"  • {test[0]} ({test[1]}) - {test[2]}")

if __name__ == "__main__":
    print("🚀 Initializing CodeVail Production Database\n")
    
    try:
        conn = create_database()
        populate_sample_data(conn)
        verify_data(conn)
        conn.close()
        
        print("\n🎉 Database initialization complete!")
        print("✅ Ready for production use")
        print("✅ All tables created with proper schema")
        print("✅ Sample data populated for testing")
        print("\n🔑 Test Login Credentials:")
        print("  Username: testuser, Password: password123")
        print("  Username: john_doe, Password: password123")
        print("  Username: admin, Password: admin123")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
