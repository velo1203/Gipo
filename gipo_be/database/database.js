const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Create users table
    db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            github_id TEXT UNIQUE,
            username TEXT,
            avatar_url TEXT,
            token TEXT,
            social_accounts TEXT ,
            biography TEXT
        )
    `
    );
    // Create projects table
    db.run(
        `
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo_id INT NOT NULL,
        uploader_id INT NOT NULL,
        title TEXT NOT NULL,
        repo_name TEXT,
        description TEXT,
        html_url TEXT NOT NULL,
        language TEXT, 
        tags TEXT,      
        image_url TEXT,  
        forks_count INT DEFAULT 0,
        stargazers_count INT DEFAULT 0,
        updated_at TIMESTAMP NOT NULL,
        readme_content TEXT,
        repositorydata TEXT
    );
    `
    );
});

module.exports = db;
