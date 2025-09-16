import sqlite3
import datetime
import os
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'users.db')

class Submission:
    @staticmethod
    def create_table():
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            code TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            flagged INTEGER DEFAULT 0
        )''')
        conn.commit()
        conn.close()

    @staticmethod
    def log_submission(username, code):
        Submission.create_table()
        ts = datetime.datetime.utcnow().isoformat()
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT INTO submissions (username, code, timestamp) VALUES (?, ?, ?)', (username, code, ts))
        conn.commit()
        conn.close()

    @staticmethod
    def get_recent_submissions(username, minutes=5):
        Submission.create_table()
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        cutoff = (datetime.datetime.utcnow() - datetime.timedelta(minutes=minutes)).isoformat()
        c.execute('SELECT * FROM submissions WHERE username=? AND timestamp>=?', (username, cutoff))
        subs = c.fetchall()
        conn.close()
        return subs

    @staticmethod
    def flag_submission(submission_id):
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('UPDATE submissions SET flagged=1 WHERE id=?', (submission_id,))
        conn.commit()
        conn.close()

    @staticmethod
    def get_flagged():
        Submission.create_table()
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT * FROM submissions WHERE flagged=1')
        flagged = c.fetchall()
        conn.close()
        return flagged

    @staticmethod
    def get_all():
        Submission.create_table()
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT * FROM submissions')
        all_subs = c.fetchall()
        conn.close()
        return all_subs
