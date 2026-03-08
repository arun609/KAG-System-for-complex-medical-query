import sqlite3
import hashlib
from datetime import datetime

DB_NAME = "medical_query_system.db"

def init_db():
    """Initialize the database with users and history tables."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Create Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    role TEXT DEFAULT 'student'
                )''')
    
    # Migration: Add role column if it doesn't exist (for existing databases)
    try:
        c.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student'")
    except sqlite3.OperationalError:
        pass # Column already exists
    
    # Create History table
    c.execute('''CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    query TEXT NOT NULL,
                    response TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )''')
    
    conn.commit()
    conn.close()

def hash_password(password):
    """Hash a password for storing."""
    return hashlib.sha256(password.encode()).hexdigest()

def add_user(username, password, role="student"):
    """Add a new user to the database."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", 
                  (username, hash_password(password), role))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_user(username, password):
    """Verify user credentials."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT id, username, role FROM users WHERE username=? AND password_hash=?", 
              (username, hash_password(password)))
    user = c.fetchone()
    conn.close()
    return user # Returns (id, username, role) or None

def add_history(user_id, query, response):
    """Log a query to history."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO history (user_id, query, response) VALUES (?, ?, ?)", 
              (user_id, query, response))
    conn.commit()
    conn.close()

def get_history(user_id):
    """Get history for a specific user."""
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT query, response, timestamp FROM history WHERE user_id=? ORDER BY timestamp DESC", (user_id,))
    rows = c.fetchall()
    conn.close()
    return [{"query": r[0], "response": r[1], "timestamp": r[2]} for r in rows]

# Initialize DB on first run
init_db()
