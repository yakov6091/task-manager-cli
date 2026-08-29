import Database from "better-sqlite3";
import path from "path";

// Will automatically create a tasks.db file if it doesn't exist yet
const db = new Database(path.join(__dirname, '../../tasks.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;