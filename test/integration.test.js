const request = require('supertest');
const { describe, it, before } = require('mocha');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const app = require('../src/index');
const expectedMoviesPath = path.join(__dirname, 'expected_movies.json');
const expectedProducersPath = path.join(__dirname, 'expected_producers.json');

function checkFilesExistence() {
    if (!fs.existsSync(expectedMoviesPath) || !fs.existsSync(expectedProducersPath)) {
        console.error('Os arquivos de referência esperados não existem. Verifique o README.md para saber como gerá-los.');
        process.exit(1);
    }
}

checkFilesExistence();

const expectedMovies = JSON.parse(fs.readFileSync(path.join(__dirname, 'expected_movies.json'), 'utf8'));
const expectedProducers = JSON.parse(fs.readFileSync(path.join(__dirname, 'expected_producers.json'), 'utf8'));

describe('Testes de Integração', function () {
    before(function (done) {
        this.timeout(10000);
        setTimeout(done, 5000);
    });

    it('Deve retornar a lista de filmes corretamente', function (done) {
        request(app)
            .get('/movies')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, expectedMovies, 'Os filmes retornados não correspondem ao esperado');
                done(err);
            });
    });

    it('Deve retornar os produtores com maior e menor intervalo corretamente', function (done) {
        request(app)
            .get('/producers/intervals')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, expectedProducers, 'Os produtores retornados não correspondem ao esperado');
                done(err);
            });
    });
});