const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // per la creazione dell'hash
const jwt = require('jsonwebtoken'); // per firmare i token

describe('POST /v1/token', () => {

    describe('Assunzione email non presente nel database', () => {
        beforeAll( () => {
            const Utente = require('../models/utente');
            Utente.find = jest.fn().mockResolvedValue([]);
        });
        test('Test #19: autenticazione con email non presente nel database', () => {
            let AutenticazionePayload = {
                email: 'test@unitn.it',
                password: 'test'
            };
            return request(app)
            .post('/v1/token')
            .set('Accept', 'application/json')
            .send(AutenticazionePayload)
            .expect(401, {error: 'Autenticazione fallita'});
        });
    });

    describe("Assumendo che ci sia l'utente", () => {
        beforeAll( () => {
            const Utente = require('../models/utente');
            Utente.find = jest.fn().mockResolvedValue([{
                _id: 0o0,
                _type: 'UtenteNormale',
                email: 'test@unitn.it',
                password: bcrypt.hashSync('test', 10)
            }]);
        });
        test('Test #20: autenticazione con password errata', () => {
            let AutenticazionePayload = {
                email: 'test@unitn.it',
                password: 'abc'
            };
            return request(app)
            .post('/v1/token')
            .set('Accept', 'application/json')
            .send(AutenticazionePayload)
            .expect(401, {error: 'Autenticazione fallita'});
        });

        test('Test #21: autenticazione con credenziali corrette', async () => {
            let AutenticazionePayload = {
                email: 'test@unitn.it',
                password: 'test'
            };
            const response = await request(app)
            .post('/v1/token')
            .set('Accept', 'application/json')
            .send(AutenticazionePayload);
            expect(response.body.message).toEqual('Autenticazione effettuata');
            expect(response.body.token).toEqual(expect.any(String));
            expect(response.body.email).toEqual('test@unitn.it');
            expect(response.body._id).toEqual(0o0);
        });
    });
});