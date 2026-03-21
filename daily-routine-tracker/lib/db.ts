import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import crypto from "crypto";
import fs from "fs";

let db: Database.Database;
let initialized = false;

function resolveDbPath(): string {
  const dataDir = process.env.DATA_DIR || process.cwd();
  return path.resolve(dataDir, "data.db");
}

function ensureDataDir(dbPath: string): void {
  const dir = path.dirname(dbPath);

  fs.mkdirSync(dir, { recursive: true });

  try {
    fs.accessSync(dir, fs.constants.W_OK);
  } catch {
    throw new Error(
      `[db] Data directory is not writable: ${dir} (user: ${process.env.USER || (process.getuid?.() ?? "unknown")}). Ensure the directory has write permissions.`
    );
  }
}

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = resolveDbPath();
    ensureDataDir(dbPath);
    console.log(`[db] Database path: ${dbPath}`);
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  if (!initialized) {
    initialized = true;
    initDb();
  }
  return db;
}

function initDb(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      must_change_password INTEGER DEFAULT 0,
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

  // Migration for existing databases
  try {
    db.exec("ALTER TABLE users ADD COLUMN must_change_password INTEGER DEFAULT 0");
  } catch {
    // Column already exists
  }

  // Seed admin user if not exists
  const adminEmail = "admin@rutinas.local";
  let admin = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail) as { id: number } | undefined;
  if (!admin) {
    const hash = bcrypt.hashSync("admin123", 10);
    const result = db.prepare(
      "INSERT INTO users (email, password_hash, must_change_password) VALUES (?, ?, 1)"
    ).run(adminEmail, hash);
    admin = { id: result.lastInsertRowid as number };
  }

  // Seed default routines if admin has none
  const routineCount = (db.prepare("SELECT COUNT(*) as count FROM routines WHERE user_id = ?").get(admin.id) as { count: number }).count;
  if (routineCount === 0) {
    const routines = [
      { name: "Kefir", start: "06:00", end: "06:10" },
      { name: "Ejercicios estiramiento", start: "06:00", end: "06:30" },
      { name: "Estudiar ingles", start: "06:30", end: "07:30" },
      { name: "Sesion trabajo 1", start: "08:00", end: "12:00" },
      { name: "Gym", start: "13:00", end: "15:00" },
      { name: "Sesion trabajo 2", start: "15:00", end: "17:00" },
      { name: "Tomar medicamento colesterol", start: "19:00", end: null },
      { name: "Sesion estudio/aprendizaje", start: "19:30", end: "20:30" },
      { name: "Planificar dia siguiente", start: "21:00", end: null },
    ];

    const insertRoutine = db.prepare(`
      INSERT INTO routines (id, user_id, name, description, category, frequency, start_time, end_time)
      VALUES (?, ?, ?, '', 'General', '"daily"', ?, ?)
    `);

    db.transaction(() => {
      for (const r of routines) {
        insertRoutine.run(crypto.randomUUID(), admin.id, r.name, r.start, r.end);
      }
    })();
  }
}

// DB is initialized lazily on first getDb() call

export function getUserCount(): number {
  return (getDb().prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }).count;
}

export function findUserByEmail(email: string) {
  return getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | { id: number; email: string; password_hash: string; must_change_password: number; created_at: string }
    | undefined;
}

export function createUser(email: string, passwordHash: string) {
  const result = getDb().prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, passwordHash);
  return { id: result.lastInsertRowid as number, email };
}

export function findUserById(id: number) {
  return getDb().prepare("SELECT id, email, must_change_password, created_at FROM users WHERE id = ?").get(id) as
    | { id: number; email: string; must_change_password: number; created_at: string }
    | undefined;
}

export function updateUserPassword(userId: number, passwordHash: string) {
  getDb().prepare("UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?").run(passwordHash, userId);
}
