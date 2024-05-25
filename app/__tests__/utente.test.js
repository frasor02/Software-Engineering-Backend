const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

// Scrittura Test Case

describe('POST /v1/utente/', () => {

    test("Test #13: Registrazione con campo email mancante", () => {
        let UtentePayload = {
            _type: "UtenteNormale",
            password: "test",
            metPagamento: "paypal",
            veicoli: []
        }
        return request(app)
        .post('/v1/utente')
        .set('Accept', 'application/json')
        .send(UtentePayload) // Manda un body Json
        .expect(400,  {error: "Missing email"} );
    });


    test("Test #14: Registrazione con campo password mancante", () => {
        let UtentePayload = {
            _type: "UtenteNormale",
            email: "test@unitn.it",
            metPagamento: "paypal",
            veicoli: []
        }
        return request(app)
        .post('/v1/utente')
        .set('Accept', 'application/json')
        .send(UtentePayload) // Manda un body Json
        .expect(400,  {error: "Missing password"} );
    });

    test("Test #15: Registrazione con campo _type diverso sia da “UtenteNormale” che da “UtenteAdmin”", () => {
        let UtentePayload = {
            _type: "abc",
            email: "test@unitn.it",
            password: "test",
            metPagamento: "paypal",
            veicoli: []
        }
        return request(app)
        .post('/v1/utente')
        .set('Accept', 'application/json')
        .send(UtentePayload) // Manda un body Json
        .expect(400,  {error: "Invalid _type field"} );
    });

    test("Test #16: Registrazione di un utente normale con campo metPagamento errato", () => {
        let UtentePayload = {
            _type: "UtenteNormale",
            email: "test@unitn.it",
            password: "test",
            metPagamento: "abc",
            veicoli: []
        }
        return request(app)
        .post('/v1/utente')
        .set('Accept', 'application/json')
        .send(UtentePayload) // Manda un body Json
        .expect(400,  {error: "Invalid metPagamento"} );
    });
    
    describe('Assunzione mail non già presente nel database', () => {
        beforeAll( () => {
            const UtenteAdmin = require('../models/utenteAdmin');
            const UtenteNormale = require('../models/utenteNormale');
            UtenteAdmin.find = jest.fn().mockResolvedValue([]);
            UtenteNormale.find = jest.fn().mockResolvedValue([]);
            UtenteAdmin.save = jest.fn().mockResolvedValue({_type: "UtenteAdmin", email: "test@unitn.it"});
            UtenteNormale.prototype.save = jest.fn().mockResolvedValue({_type: "UtenteNormale", email: "test@unitn.it"});
        });
        
        test("Test #17: Registrazione di un utente normale con input corretto.", () => {
            let UtentePayload = {
                _type: "UtenteNormale",
                email: "test@unitn.it",
                password: "test",
                metPagamento: "carta di credito",
                veicoli: [{tipoVeicolo: "auto", targa: "TEST1234"}]
            }
            return request(app)
            .post('/v1/utente')
            .set('Accept', 'application/json')
            .send(UtentePayload) // Manda un body Json
            .expect(201,  {message: 'Utente creato', utenteCreato: { _type: 'UtenteNormale', email: 'test@unitn.it'}} );
        });
    });
    
    describe('Assunzione mail già presente nel database', () => {
        beforeAll( () => {
            
            const UtenteAdmin = require('../models/utenteAdmin');
            const UtenteNormale = require('../models/utenteNormale');
            UtenteAdmin.find = jest.fn().mockResolvedValue([{email: "test@unitn.it", __v: 0}]); // A Fake mocked body
            UtenteNormale.find = jest.fn().mockResolvedValue([{email: "test@unitn.it", __v: 0}]);
        });

        test("Test #18: Registrazione di un utente con email già presente nel database", () => {
            let UtentePayload = {
                _type: "UtenteAdmin",
                email: "test@unitn.it",
                password: "test"
            }
            return request(app)
            .post('/v1/utente')
            .set('Accept', 'application/json')
            .send(UtentePayload) // Manda un body Json
            .expect(409,  {error: 'Email già esistente'} );
        });
    })
})