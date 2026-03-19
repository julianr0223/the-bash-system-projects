import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

export function initDb(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'General',
      frequency TEXT NOT NULL DEFAULT '"daily"',
      start_time TEXT,
      end_time TEXT,
      goal INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      completed_at TEXT DEFAULT (datetime('now')),
      UNIQUE(routine_id, date)
    );
  `);
}

// Ensure DB is initialized on first import
initDb();

export function getUserCount(): number {
  return (getDb().prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }).count;
}

export function findUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | { id: number; email: string; password_hash: string; created_at: string }
    | undefined;
}

export function createUser(email: string, passwordHash: string) {
  const result = getDb().prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, passwordHash);
  return { id: result.lastInsertRowid as number, email };
}

export function findUserById(id: number) {
  return getDb().prepare("SELECT id, email, created_at FROM users WHERE id = ?").get(id) as
    | { id: number; email: string; created_at: string }
    | undefined;
}
