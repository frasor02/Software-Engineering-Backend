const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Test = require('supertest/lib/test');
const jwt = require('jsonwebtoken'); // per creare e firmare i token

// Scrittura Test Case

describe('POST /v1/parcheggio/', () => {


    beforeAll(async () => {
        //jest.setTimeout(8000);
        //jest.unmock('mongoose');
        //connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
        //console.log('Database connected!');
    });
    
    afterAll( () => {
        //mongoose.connection.close(true);
        //console.log("Database connection closed");
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
        ParcheggioPayload = {
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
        ParcheggioPayload = {
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
        .expect(400, { error: 'ParcheggioPay validation failed: tariffa: Path `tariffa` (-1) is less than minimum allowed value (0).' });
    });

    test("Test #2: Inserimento di un nuovo parcheggio vigilato con stato parcheggio non valido", async () => {
        ParcheggioPayload = {
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
        .expect(400, { error: 'ParcheggioVigilato validation failed: statoParcheggio: `abc` is not a valid enum value for path `statoParcheggio`.' });
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
    let parcheggioDelete;
    var parcheggioId = new mongoose.Types.ObjectId();

    beforeAll( () => {
        const Parcheggio = require('../models/parcheggio');
        parcheggioDelete = jest.spyOn(Parcheggio, 'findByIdAndDelete').mockImplementation((id) => {
            if(id === parcheggioId){
                return new Promise.resolve();
            } else {
                return new Promise.reject(new Error())
            }
        });
    });
    
    afterAll(async () => {
        parcheggioDelete.mockRestore();
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
        .expect(500, {  }); //error: 'parcheggio not found to delete'

    });
});
