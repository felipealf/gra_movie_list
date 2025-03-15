const db = require('../database');

function getAllMovies(callback) {
    db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
}

module.exports = { getAllMovies };