const express = require('express');
const router = express.Router();
const { getProducersWithIntervals } = require('../services/producerService');

router.get('/intervals', (req, res) => {
    getProducersWithIntervals((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

module.exports = router;
