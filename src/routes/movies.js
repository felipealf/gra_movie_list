const express = require('express');
const router = express.Router();
const { getAllMovies } = require('../services/movieService');

router.get('/', (req, res) => {
    getAllMovies((err, movies) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(movies);
    });
});

module.exports = router;