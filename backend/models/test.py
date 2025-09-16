import sqlite3
import os
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'users.db')

class Test:
    def __init__(self, title, candidate, interviewer, status='ongoing', score=None):
        self.title = title
        self.candidate = candidate
        self.interviewer = interviewer
        self.status = status
        self.score = score

    @staticmethod
    def create_table():
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            candidate TEXT NOT NULL,
            interviewer TEXT NOT NULL,
            status TEXT NOT NULL,
            score INTEGER
        )''')
        conn.commit()
        conn.close()

    @staticmethod
    def add_test(title, candidate, interviewer):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT INTO tests (title, candidate, interviewer, status) VALUES (?, ?, ?, ?)', (title, candidate, interviewer, 'ongoing'))
        conn.commit()
        conn.close()

    @staticmethod
    def update_status(test_id, status):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('UPDATE tests SET status=? WHERE id=?', (status, test_id))
        conn.commit()
        conn.close()

    @staticmethod
    def update_score(test_id, score):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('UPDATE tests SET score=? WHERE id=?', (score, test_id))
        conn.commit()
        conn.close()

    @staticmethod
    def get_tests_by_user(username):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT * FROM tests WHERE candidate=? OR interviewer=?', (username, username))
        tests = c.fetchall()
        conn.close()
        return tests
