const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../database');

function detectDelimiter(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        const firstLine = data.split('\n')[0];
        const delimiter = firstLine.includes(';') ? ';' : ',';
        callback(null, delimiter);
    });
}

function importCSVFromFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Erro ao ler a pasta:', err.message);
            return;
        }

        const csvFiles = files.filter(file => file.endsWith('.csv'));

        if (csvFiles.length === 0) {
            console.log('Nenhum arquivo CSV encontrado.');
            return;
        }

        csvFiles.forEach(file => {
            const filePath = path.join(folderPath, file);
            console.log(`Importando arquivo: ${filePath}`);
            importCSV(filePath);
        });
    });
}

function importCSV(filePath) {
    detectDelimiter(filePath, (err, delimiter) => {
        if (err) {
            console.error('Erro ao detectar delimitador:', err.message);
            return;
        }

        const stmt = db.prepare(`INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)`);
        
        fs.createReadStream(filePath)
            .pipe(csv({ separator: delimiter }))
            .on('data', (row) => {
                stmt.run(row.year, row.title, row.studios, row.producers, row.winner);
            })
            .on('end', () => {
                stmt.finalize();
                console.log('CSV importado com sucesso!');
                initializeProducersTable();
            })
            .on('error', (err) => {
                console.error('Erro ao importar CSV:', err.message);
            });
    });
}

function initializeProducersTable() {
    db.serialize(() => {
        db.all(`SELECT year, TRIM(producers) AS producers FROM movies WHERE winner = 'yes'`, [], (err, rows) => {
            if (err) {
                console.error('Erro ao buscar vencedores:', err.message);
                return;
            }

            const insertStmt = db.prepare(`INSERT INTO producer_wins (producer, year) VALUES (?, ?)`);
            
            rows.forEach(row => {
                const producers = row.producers.replace(' and ', ',').split(',').map(p => p.trim());
                producers.forEach(producer => insertStmt.run(producer, row.year));
            });

            insertStmt.finalize();
            console.log('Tabela de produtores vencedores populada com sucesso!');
        });
    });
}

module.exports = { importCSVFromFolder };