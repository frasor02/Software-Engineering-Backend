const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // per creare e firmare i token

// Scrittura Test Case

describe('POST /v1/parcheggio/', () => {
    beforeAll( () => {
        const e = new Error("Validation failed"); // e.name is 'Error'
        e.name = "ValidationError";
        const ParcheggioFree = require('../models/parcheggioFree');
        const ParcheggioPay = require('../models/parcheggioPay');
        const ParcheggioVigilato = require('../models/parcheggioVigilato');
        ParcheggioFree.prototype.save = jest.fn().mockRejectedValue(e);
        ParcheggioPay.prototype.save = jest.fn().mockRejectedValue(e);
        ParcheggioVigilato.prototype.save = jest.fn().mockRejectedValue(e);


    });

    // Creazione token valido
    var payload = {
        _id: mongoose.Schema.Types.ObjectId,
        _type: "UtenteAdmin",
        email: "admin@test.com"
    }
    var options = {
        expiresIn: "1h" // scadenza in un ora
    }
    var token = jwt.sign(payload,process.env.JWT_KEY, options);

    test("Test #0: Inserimento di un nuovo parcheggio gratuito con nome non valido", async () => {
        let ParcheggioPayload = {
            _type: "ParcheggioFree",
            nome: "",
            posizione: {type: {type: "Point"},coordinates: [12,15]},
            numPosti: 500,
            isCoperto: true,
            statoParcheggio: "Disponibile",
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

    test("Test #1: Inserimento di un nuovo parcheggio a pagamento con tariffa negativa", async () => {
        let ParcheggioPayload = {
            _type: "ParcheggioPay",
            nome: "Parcheggio Piazza Test",
            posizione: {type: {type: "Point"},coordinates: [12,15]},
            numPosti: 500,
            isCoperto: true,
            statoParcheggio: "Non disponibile",
            numPostiDisabili: 0,
            numPostiGravidanza: 0,
            numPostiAuto: 500,
            numPostiMoto: 0,
            numPostiFurgone : 0,
            numPostiBus : 0,
            tariffa: -1
        };


        return request(app)
        .post('/v1/parcheggio')
        .set('Authorization', "Bearer " + token)
        .set('Accept', 'application/json')
        .send(ParcheggioPayload) // Manda un body Json
        .expect(400, { error: "Validation failed" });
    });

    test("Test #2: Inserimento di un nuovo parcheggio vigilato con stato parcheggio non valido", async () => {
        let ParcheggioPayload = {
            _type: "ParcheggioVigilato",
            nome: "Parcheggio Piazza Test",
            posizione: {type: {type: "Point"},coordinates: [12,15]},
            numPosti: 500,
            isCoperto: true,
            statoParcheggio: "abc",
            numPostiDisabili: 0,
            numPostiGravidanza: 0,
            numPostiAuto: 500,
            numPostiMoto: 0,
            numPostiFurgone : 0,
            numPostiBus : 0,
            postiOccupati: {
                postiOcc:0,
                postiOccDisabili:0,
                postiOccGravidanza:0,
                postiOccAuto:0,
                postiOccMoto:0,
                postiOccFurgone:0,
                postiOccBus:0
            },
            tariffa: 2.50
        };


        return request(app)
        .post('/v1/parcheggio')
        .set('Authorization', "Bearer " + token)
        .set('Accept', 'application/json')
        .send(ParcheggioPayload) // Manda un body Json
        .expect(400, { error: "Validation failed" });
    });

});

describe('PATCH /v1/parcheggio/:parcheggioId', () => {

    // Creazione token valido
    var payload = {
        _id: mongoose.Schema.Types.ObjectId,
        _type: "UtenteAdmin",
        email: "admin@test.com"
    }
    var options = {
        expiresIn: "1h" // scadenza in un ora
    }
    var token = jwt.sign(payload,process.env.JWT_KEY, options);

    test("Test #3: Modifica di un parcheggio esistente con proprietà propName non valida", () => {
        UpdatePayload = [
            {propName : "abc", // Non valido
            value : 0}
        ]; 

        return request(app)
        .patch('/v1/parcheggio/:' + new mongoose.Types.ObjectId())
        .set('Authorization', "Bearer " + token)
        .set('Accept', 'application/json')
        .send(UpdatePayload) // Manda un body Json
        .expect(400, { error: 'invalid propName field' });

    });

});

describe("DELETE /v1/parcheggio/:parcheggioId", () => {
    var parcheggioId = new mongoose.Types.ObjectId();

    beforeAll( () => {
        const Parcheggio = require('../models/parcheggio');
        Parcheggio.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    });
    
    // Creazione token valido
    var payload = {
        _id: mongoose.Schema.Types.ObjectId,
        _type: "UtenteAdmin",
        email: "admin@test.com"
    }
    var options = {
        expiresIn: "1h" // scadenza in un ora
    }
    var token = jwt.sign(payload,process.env.JWT_KEY, options);

    test("Test #4: Rimozione di un parcheggio con id non salvato in database", () => {
        return request(app)
        .delete('/v1/parcheggio/:' + parcheggioId)
        .set('Authorization', "Bearer " + token)
        .set('Accept', 'application/json')
        .expect(404, { error: 'parcheggio not found to delete' });

    });
});

describe("GET /v1/parcheggio/ricerca", () => {
    beforeAll( () => {
        const Parcheggio = require('../models/parcheggio');
        Parcheggio.find = jest.fn().mockResolvedValue([]);
    });

    test("Test #5: Ricerca con longitudine invalida", () => {
        const query = {
            long : 180, // Non valido
            lat : 46.046073449255646,
            isCoperto : true,
            utente : undefined,
            veicolo: undefined
        }
        return request(app)
        .get('/v1/parcheggio/ricerca?long=' + query.long + '&lat=' + query.lat + '&isCoperto=' + query.isCoperto + '&utente=' + query.utente + '&veicolo=' + query.veicolo)
        .set('Accept', 'application/json')
        .expect(400, { error: 'long out of map bounds' });
    });


    test("Test #6: Ricerca con latitudine invalida", () => {
        const query = {
            long : 11.098098093783192,
            lat : 2000, // non valida
            isCoperto : true,
        }
        return request(app)
        .get('/v1/parcheggio/ricerca?long=' + query.long + '&lat=' + query.lat + '&isCoperto=' + query.isCoperto)
        .set('Accept', 'application/json')
        .expect(400, { error: 'lat out of map bounds' });
    });

    test("Test #7: Ricerca con parametro isCoperto non valido", () => {
        const query = {
            long : 11.098098093783192,
            lat : 46.046073449255646,
            isCoperto : "abc", // Non valido

        }
        return request(app)
        .get('/v1/parcheggio/ricerca?long=' + query.long + '&lat=' + query.lat + '&isCoperto=' + query.isCoperto)
        .set('Accept', 'application/json')
        .expect(400, { error: 'isCoperto not boolean' });
    });

    test("Test #8: Ricerca con parametro utente non valido", () => {
        const query = {
            long : 11.098098093783192,
            lat : 46.046073449255646,
            isCoperto : true,
            utente : "abc", // non valido
        }
        return request(app)
        .get('/v1/parcheggio/ricerca?long=' + query.long + '&lat=' + query.lat + '&isCoperto=' + query.isCoperto + '&utente=' + query.utente)
        .set('Accept', 'application/json')
        .expect(400, { error: 'utente not valid' });
    });


    test("Test #9: Ricerca con parametro veicolo non valido", () => {
        const query = {
            long : 11.098098093783192,
            lat : 46.046073449255646,
            isCoperto : true,
            veicolo: "abc" // non valido
        }
        return request(app)
        .get('/v1/parcheggio/ricerca?long=' + query.long + '&lat=' + query.lat + '&isCoperto=' + query.isCoperto +  '&veicolo=' + query.veicolo)
        .set('Accept', 'application/json')
        .expect(400, { error: 'veicolo not valid' });
    });

    test("Test #10: Ricerca con risultato vuoto", () => {
        const query = {
            long : 11.098098093783192,
            lat : 46.046073449255646,
            isCoperto : true,
            utente: "disabile",
            veicolo: "auto"
        }
        return request(app)
        .get('/v1/parcheggio/ricerca?long=' + query.long + '&lat=' + query.lat + '&isCoperto=' + query.isCoperto + '&utente=' + query.utente + '&veicolo=' + query.veicolo)
        .set('Accept', 'application/json')
        .expect(200, { count: 0, parcheggi: []  });
    });
});

describe('GET /v1/parcheggio', () => {
    const pId1 = new mongoose.Types.ObjectId();
    const pId2 = new mongoose.Types.ObjectId();
    const pId3 = new mongoose.Types.ObjectId();
    beforeAll(() => {
        const Parcheggio = require('../models/parcheggio');
        Parcheggio.find = jest.fn().mockResolvedValue( 
            [{
                _id: pId1,
                _type: 'ParcheggioFree',
                nome: 'p1'
            },
            {
                _id: pId2,
                _type: 'ParcheggioPay',
                nome: 'p2'
            },
            {
                _id: pId3,
                _type: 'ParcheggioVigilato',
                nome: 'p3'
            }]
        );
    });

    test('Test #39: visualizzazione di tutti i parcheggi', () => {
    return request(app)
        .get('/v1/parcheggio')
        .send()
        .expect(200, {
            count: 3,
            parcheggi: [{
                _id: `${pId1._id}`,
                _type: 'ParcheggioFree',
                nome: 'p1',
                request: {
                    type: "GET",
                    url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/:" + pId1
                }
            },
            {
                _id: `${pId2._id}`,
                _type: 'ParcheggioPay',
                nome: 'p2',
                request: {
                    type: "GET",
                    url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/:" + pId2
                }
            },
            {
                _id: `${pId3._id}`,
                _type: 'ParcheggioVigilato',
                nome: 'p3',
                request: {
                    type: "GET",
                    url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/:" + pId3
                }
            }]
        });       
    });
});

describe("GET /v1/parcheggio/:parcheggioId", () => {
    beforeAll( () => {
        const Parcheggio = require('../models/parcheggio');
        Parcheggio.findById = jest.fn().mockResolvedValue({});
    });

    test("Test #11: Ricerca parcheggio con parcheggioId non valido", ()=>{
        return request(app)
        .get('/v1/parcheggio/:' + "abc") // Invio id non valido
        .set('Accept', 'application/json')
        .expect(400, { error: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters' });
    });

    test("Test #12: Ricerca parcheggio con parcheggioId non esistente", ()=>{
        var parcheggioId = new mongoose.Types.ObjectId(); // Generiamo un id con formato valido
        return request(app)
        .get('/v1/parcheggio/:' + parcheggioId)
        .set('Accept', 'application/json')
        .expect(200, {"res": {}});
    });
});

describe('GET /v1/parcheggio/:parcheggioId/prenotazione', () => {
    // Creazione token valido
    var payload = {
        _id: mongoose.Schema.Types.ObjectId,
        _type: "UtenteAdmin",
        email: "admin@test.com"
    }
    var options = {
        expiresIn: "1h" // scadenza in un ora
    }
    var token = jwt.sign(payload,process.env.JWT_KEY, options);
    beforeAll(() => {
        const Prenotazione = require('../models/prenotazione');
        Prenotazione.find = jest.fn()
        .mockResolvedValue([]);
    });

    test('Test #24: visualizzazione di prenotazioni di un parcheggio non vigilato', () => {
        return request(app)
        .get('/v1/parcheggio/:' + new mongoose.Types.ObjectId() + '/prenotazione')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200, {
            count: 0,
            prenotazioni: []
        });
    });
});