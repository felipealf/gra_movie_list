const request = require('supertest');
const { describe, it, before } = require('mocha');
const assert = require('assert');
const app = require('../src/index');

describe('Testes de Integração', function () {
    before((done) => {
        setTimeout(done, 1000);
    });

    it('Deve retornar a lista de filmes', function (done) {
        request(app)
            .get('/movies')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.ok(res.body.length > 0);
                done(err);
            });
    });

    it('Deve retornar os produtores com maior e menor intervalo entre vitórias', function (done) {
        request(app)
            .get('/producers/intervals')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                assert.ok(res.body.max);
                assert.ok(res.body.min);
                done(err);
            });
    });
});
