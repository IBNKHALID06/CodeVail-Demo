import sqlite3
import datetime
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'users.db')


class Assignment:
    @staticmethod
    def create_table():
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute(
            '''CREATE TABLE IF NOT EXISTS assignments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                test_id INTEGER,
                time_limit_sec INTEGER NOT NULL,
                started_at TEXT,
                status TEXT NOT NULL DEFAULT 'assigned'
            )'''
        )
        conn.commit()
        conn.close()

    @staticmethod
    def start(username: str, test_id: int | None, time_limit_sec: int) -> int:
        Assignment.create_table()
        now = datetime.datetime.utcnow().isoformat()
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        # Ensure only one active assignment per user
        c.execute("UPDATE assignments SET status='completed' WHERE username=? AND status!='completed'", (username,))
        c.execute(
            'INSERT INTO assignments (username, test_id, time_limit_sec, started_at, status) VALUES (?, ?, ?, ?, ?)',
            (username, test_id, time_limit_sec, now, 'in_progress')
        )
        assignment_id = c.lastrowid
        conn.commit()
        conn.close()
        return assignment_id

    @staticmethod
    def complete(assignment_id: int) -> None:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('UPDATE assignments SET status=? WHERE id=?', ('completed', assignment_id))
        conn.commit()
        conn.close()

    @staticmethod
    def get_active_for_user(username: str):
        Assignment.create_table()
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, username, test_id, time_limit_sec, started_at, status FROM assignments WHERE username=? AND status='in_progress' ORDER BY id DESC LIMIT 1", (username,))
        row = c.fetchone()
        conn.close()
        return row
