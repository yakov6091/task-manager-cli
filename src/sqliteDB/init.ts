import db from "./sqlite";

export function initDb() {
    // Create Users Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
           id TEXT PRIMARY KEY,
           username TEXT UNIQUE NOT NULL,
           password TEXT NOT NULL
        );
    `);

    // Create Tasks Table linked to Users
    db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
           id TEXT PRIMARY KEY,
           title TEXT NOT NULL,
           description TEXT DEFAULT '',
           isComplete INTEGER DEFAULT 0,
           userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE 
        );
    `);

    console.log('Database tables initialized successfully.');
}