import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { app } from "electron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function run(db: sqlite3.Database, sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function all(db: sqlite3.Database, sql: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

export async function runMigrations(db: sqlite3.Database) {
  const migrationsDir = app.isPackaged
    ? path.join(process.resourcesPath, "migrations")
    : path.join(__dirname, "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.warn("Migrations folder not found:", migrationsDir);
    return; // Skip migrations if folder missing
  }
  await run(
    db,
    `
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `
  );

  const executed = await all(db, `SELECT name FROM migrations`);
  const executedNames = executed.map((m) => m.name);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (executedNames.includes(file)) continue;

    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

    try {
      await run(db, "BEGIN TRANSACTION;");
      await run(db, sql);
      await run(db, `INSERT INTO migrations (name) VALUES ('${file}');`);
      await run(db, "COMMIT;");
      console.log(`✔ Migration applied: ${file}`);
    } catch (err) {
      await run(db, "ROLLBACK;");
      console.error(`✖ Migration failed: ${file}`, err);
      throw err;
    }
  }
}
