const db = require('../database');

function getProducersWithIntervals(callback) {
    const query = `
        WITH producer_intervals AS (
            SELECT producer, year,
                   LAG(year) OVER (PARTITION BY producer ORDER BY year) AS previousWin
            FROM producer_wins
        )
        SELECT producer, previousWin, year AS followingWin, (year - previousWin) AS interval 
        FROM producer_intervals
        WHERE previousWin IS NOT NULL
        ORDER BY interval DESC, previousWin ASC;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }

        if (rows.length === 0) {
            return callback(null, { message: "Nenhum produtor com múltiplas vitórias encontrado" });
        }

        const maxInterval = Math.max(...rows.map(row => row.interval));
        const minInterval = Math.min(...rows.map(row => row.interval));

        const maxProducers = rows.filter(row => row.interval === maxInterval).map(row => ({
            producer: row.producer,
            interval: row.interval,
            previousWin: row.previousWin,
            followingWin: row.followingWin
        }));

        const minProducers = rows.filter(row => row.interval === minInterval).map(row => ({
            producer: row.producer,
            interval: row.interval,
            previousWin: row.previousWin,
            followingWin: row.followingWin
        }));

        callback(null, {
            max: maxProducers,
            min: minProducers
        });
    });
}

module.exports = { getProducersWithIntervals };