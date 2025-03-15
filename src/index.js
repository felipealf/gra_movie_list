const express = require('express');
const moviesRoutes = require('./routes/movies');
const producersRoutes = require('./routes/producers');
const { importCSVFromFolder } = require('./services/dataService');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dataFolder = path.join(__dirname, 'data');
importCSVFromFolder(dataFolder);

app.use('/movies', moviesRoutes);
app.use('/producers', producersRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;
