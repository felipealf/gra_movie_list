const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year INTEGER,
        title TEXT,
        studios TEXT,
        producers TEXT,
        winner TEXT
    )`);
    
    db.run(`CREATE TABLE producer_wins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producer TEXT,
        year INTEGER
    )`);
});

module.exports = db;
