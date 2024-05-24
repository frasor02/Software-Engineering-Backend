require("dotenv").config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Test = require('supertest/lib/test');
const jwt = require('jsonwebtoken'); // per creare e firmare i token
// Scrittura Test Case

describe('POST /v1/parcheggio/', () => {
    // Mock save mongoose function
    let parcheggioSave;

    beforeAll( () => {
        const ParcheggioFree = require('../models/parcheggioFree');
        parcheggioSave = jest.spyOn(ParcheggioFree.prototype, "save").mockImplementation(() => Promise.resolve(ParcheggioFree));
      });
    
    afterEach(async () => {
        parcheggioSave.mockRestore();
    });

    // Creazione token valido
    var payload = {
        _id: mongoose.Schema.Types.ObjectId,
        _type: "UtenteAdmin",
        email: "admin@test.com"
    }
    var options = {
        expiresIn: "1h" // expires in 1 hour
    }
    var token = jwt.sign(payload,process.env.JWT_KEY, options);

    test("Test #1: Inserimento di un nuovo parcheggio gratuito con nome non valido", async () => {
        ParcheggioPayload = {
            _type: "ParcheggioFree",
            nome: "",
            posizione: {type: {type: "Point"},coordinates: [12,15]},
            numPosti: 500,
            isCoperto: true,
            statoParcheggio: "Disponinile",
            numPostiDisabili: 0,
            numPostiGravidanza: 0,
            numPostiAuto: 500,
            numPostiMoto: 0,
            numPostiFurgone : 0,
            numPostiBus : 0,
            isDisco: false
        };


        return request(app)
        .post('/v1/parcheggio')
        .set('Authorization', "Bearer " + token)
        .set('Accept', 'application/json')
        .send(ParcheggioPayload) // Manda un body Json
        .expect(400, { error: 'undefined nome field' });
    });



});