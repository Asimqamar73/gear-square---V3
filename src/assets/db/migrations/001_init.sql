-- Create the migrations table
CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mark existing schema as applied
INSERT OR IGNORE INTO migrations (name)
VALUES ('000_existing_schema.sql');
