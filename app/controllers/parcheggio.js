const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');
const ParcheggioFree = require('../models/parcheggioFree');
const ParcheggioPay = require('../models/parcheggioPay');
const ParcheggioVigilato = require('../models/parcheggioVigilato');
const Prenotazione = require('../models/prenotazione');
const Feedback = require('../models/feedback');

/*Logica delle API dirette alla risorsa parcheggi.*/

/**
 * Funzione utility per la ricerca.
 * @param {Object} res Risposta
 * @param {Number} long Longitudine selezionata per la ricerca
 * @param {Number} lat Latitudine selezionata per la ricerca
 * @param {Boolean} isCoperto Parcheggio coperto o meno
 * @param {Number} disabili Presenza posti per disabili 
 * @param {Number} gravidanza Presenza posti per donne in gravidanza 
 * @param {Number} auto Presenza posti per auto
 * @param {Number} moto Presenza posti per moto
 * @param {Number} furgone Presenza posti per furgone
 * @param {Number} bus Presenza posti per bus
 */
function findRicerca(res, long, lat, isCoperto, disabili, gravidanza, auto, moto, furgone, bus){
    Parcheggio.find(    // Ricerca secondo i parametri scelti
        {
            statoParcheggio: "Disponibile",
            isCoperto: isCoperto,
            numPostiDisabili: { $gt: disabili},
            numPostiGravidanza: { $gt: gravidanza},
            numPostiAuto: { $gt: auto},
            numPostiMoto: { $gt: moto},
            numPostiFurgone: { $gt: furgone},
            numPostiBus: { $gt: bus},
            
            posizione:
            {
                $near: 
                {
                    $geometry: { type: "Point",  coordinates: [ long, lat ] }   // Ordinamento dal più vicino alla posizione scelta

                }
            }
        }
        
    )
    .then(
        docs => {
            const response = {
                count: docs.length,
                parcheggi: docs.map(doc =>{
                    return {
                        _id: doc._id,
                        _type: doc._type,
                        nome: doc.nome,
                        request: {
                            type: "GET",
                            url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/" + doc._id
                        }
                    }
                })
            }
                res.status(200).json(response);
            } 
    ) .catch(
        err => {
            console.log(err);
            res.status(500).json({ // Errore nella ricerca
                error: err
            })
        }
    )


}

//funzione che implementa la chiamata get /parcheggio/ricerca
exports.parcheggio_ricerca = (req, res) => {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let isCoperto = req.query.isCoperto;
    let utente = req.query.utente;
    if(utente === undefined){
        utente = "default";
    }
    let veicolo = req.query.veicolo;
    if(veicolo === undefined){
        veicolo = "default";
    }
    // Controllo dell'input
    if(lat < 46.036073449255646 || lat > 46.17933757653747){
        res.status(400).json({error: "lat out of map bounds"});
        return;
    }
    if(long < 11.097098093783192 || long > 11.171938222971134){
        res.status(400).json({error: "long out of map bounds"})
        return;
    }
    
    if (!["true", "false"].includes(isCoperto)) {
        res.status(400).json({error: "isCoperto not boolean"})
        return;
    }
    
    validUtente = ["disabile", "gravidanza", "default"];
    
    if(!validUtente.includes(utente)){
        res.status(400).json({error: "utente not valid"})
        return;
    }
    validVeicolo = ["auto","moto","furgone","bus", "default"];
    if(!validVeicolo.includes(veicolo)){
        res.status(400).json({error: "veicolo not valid"})
        return;
    }
    
    switch (utente) { 
        case "disabile": {
            switch (veicolo) {   
                case "auto":
                    findRicerca(res, long, lat, isCoperto, 0, -1, 0, -1, -1, -1);
                    break;
                case "moto":
                    findRicerca(res, long, lat, isCoperto, 0, -1, -1, 0, -1, -1);
                    break;
                case "furgone":
                    findRicerca(res, long, lat, isCoperto, 0, -1, -1, -1, 0, -1);
                    break;
                case "bus":
                    findRicerca(res, long, lat, isCoperto, 0, -1, -1, -1, -1, 0);
                    break;
                default:
                    findRicerca(res, long, lat, isCoperto, 0, -1, -1, -1, -1, -1);
                    break;
            }
            break;
        }
        case "gravidanza": {
            switch (veicolo) {   
                case "auto":
                    findRicerca(res, long, lat, isCoperto, -1, 0, 0, -1, -1, -1);
                    break;
                case "moto":
                    findRicerca(res, long, lat, isCoperto, -1, 0, -1, 0, -1, -1);
                    break;
                case "furgone":
                    findRicerca(res, long, lat, isCoperto, -1, 0, -1, -1, 0, -1);
                    break;
                case "bus":
                    findRicerca(res, long, lat, isCoperto, -1, 0, -1, -1, -1, 0);
                    break;
                default:
                    findRicerca(res, long, lat, isCoperto, -1, 0, -1, -1, -1, -1);
                    break;
            }
            break;
        }
        default: {
            switch (veicolo) {   
                case "auto":
                    findRicerca(res, long, lat, isCoperto, -1, -1, 0, -1, -1, -1);
                    break;
                case "moto":
                    findRicerca(res, long, lat, isCoperto, -1, -1, -1, 0, -1, -1);
                    break;
                case "furgone":
                    findRicerca(res, long, lat, isCoperto, -1, -1, -1, -1, 0, -1);
                    break;
                case "bus":
                    findRicerca(res, long, lat, isCoperto, -1, -1, -1, -1, -1, 0);
                    break;
                default:
                    findRicerca(res, long, lat, isCoperto, -1, -1, -1, -1, -1, -1);
                    break;
            }
            break;
        }
    }
        
      
}

//Funzione che implementa la chiamata GET a /v1/parcheggio/:parcheggioId
exports.parcheggio_get = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1));
        if(!mongoose.Types.ObjectId.isValid(id)){ // Controllo validità ID
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({
            error: err.message  // formato id del parcheggio non valido
        });
        return; // Risolve "Cannot set headers after they are sent to the client"
    };
    Parcheggio.findById(id)
    .then(
        doc => {
            res.status(200).json({
                "res":{
                    "_type": doc._type,
                    "_id": doc._id,
                    "nome": doc.nome,
                    "type": doc.type,
                    "posizione": doc.posizione,
                    "numPosti": doc.numPosti,
                    "statoParcheggio": doc.statoParcheggio,
                    "numPostiDisabili": doc.numPostiDisabili,
                    "numPostiGravidanza": doc.numPostiGravidanza,
                    "numPostiAuto": doc.numPostiAuto,
                    "numPostiMoto": doc.numPostiMoto,
                    "numPostiFurgone": doc.numPostiFurgone,
                    "numPostiBus": doc.numPostiBus,
                    "isDisco": doc.isDisco,
                    "dataInizio": doc.dataInizio, 
                    "dataFine": doc.dataFine,
                    "tariffa": doc.tariffa,
                    "postiOccupati": doc.postiOccupati
                }  
            })
        }

    ) .catch(
        err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        }
    )
}

// Funzione che implementa la chiamata GET a /v1/parcheggio
exports.parcheggio_get_all = (req, res) => {
    Parcheggio.find({})
    .select("_id _type nome")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            parcheggi: docs.map(doc =>{
                return {
                    _id: doc._id,
                    _type: doc._type,
                    nome: doc.nome,
                    request: {
                        type: "GET",
                        url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/:" + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({  // Errore nella ricerca
            error: err
        })
    });
};

// Funzione che implementa la chiamata POST a /v1/parcheggio
exports.parcheggio_post = (req, res) => {
    let parcheggio;
    try{
        if(req.body._type != "ParcheggioFree" &&  req.body._type != "ParcheggioPay" && req.body._type != "ParcheggioVigilato"){ // Controllo validità sul tipo di parcheggio
            throw new Error("undefined _type field");
        };
        if(req.body.nome === ""){ // Controllo che il nome del parcheggio non sia vuoto
            throw new Error("undefined nome field");
        };
        switch(req.body._type){
            case "ParcheggioFree":{
                if(req.body.isDisco){
                    if(req.body.dataInizio == undefined || req.body.dataFine == undefined){
                        throw new Error("undefined dataInizio o dataFine"); // Orari del disco orario invalidi
                    }
                    console.log(req.body.dataInizio);
                    parcheggio = new ParcheggioFree({
                        _id: new mongoose.Types.ObjectId(),
                        nome: req.body.nome,
                        posizione: req.body.posizione,
                        numPosti: req.body.numPosti,
                        isCoperto: req.body.isCoperto,
                        statoParcheggio: req.body.statoParcheggio,
                        numPostiDisabili: req.body.numPostiDisabili,
                        numPostiGravidanza: req.body.numPostiGravidanza,
                        numPostiAuto: req.body.numPostiAuto,
                        numPostiMoto: req.body.numPostiMoto,
                        numPostiFurgone : req.body.numPostiFurgone,
                        numPostiBus : req.body.numPostiBus,
                        isDisco: req.body.isDisco,
                        dataInizio: req.body.dataInizio,
                        dataFine: req.body.dataFine})
                } else{
                    parcheggio = new ParcheggioFree({
                        _id: new mongoose.Types.ObjectId(),
                        nome: req.body.nome,
                        posizione: req.body.posizione,
                        numPosti: req.body.numPosti,
                        isCoperto: req.body.isCoperto,
                        statoParcheggio: req.body.statoParcheggio,
                        numPostiDisabili: req.body.numPostiDisabili,
                        numPostiGravidanza: req.body.numPostiGravidanza,
                        numPostiAuto: req.body.numPostiAuto,
                        numPostiMoto: req.body.numPostiMoto,
                        numPostiFurgone : req.body.numPostiFurgone,
                        numPostiBus : req.body.numPostiBus,
                        isDisco: req.body.isDisco
                    });
                }
                break;
            }
            case "ParcheggioPay":{
                parcheggio = new ParcheggioPay({
                    _id: new mongoose.Types.ObjectId(),
                    nome: req.body.nome,
                    posizione: req.body.posizione,
                    numPosti: req.body.numPosti,
                    isCoperto: req.body.isCoperto,
                    statoParcheggio: req.body.statoParcheggio,
                    numPostiDisabili: req.body.numPostiDisabili,
                    numPostiGravidanza: req.body.numPostiGravidanza,
                    numPostiAuto: req.body.numPostiAuto,
                    numPostiMoto: req.body.numPostiMoto,
                    numPostiFurgone : req.body.numPostiFurgone,
                    numPostiBus : req.body.numPostiBus,
                    tariffa: req.body.tariffa});
                break;
            }
            case "ParcheggioVigilato":{
                parcheggio = new ParcheggioVigilato({
                    _id: new mongoose.Types.ObjectId(),
                    nome: req.body.nome,
                    posizione: req.body.posizione,
                    numPosti: req.body.numPosti,
                    isCoperto: req.body.isCoperto,
                    statoParcheggio: req.body.statoParcheggio,
                    numPostiDisabili: req.body.numPostiDisabili,
                    numPostiGravidanza: req.body.numPostiGravidanza,
                    numPostiAuto: req.body.numPostiAuto,
                    numPostiMoto: req.body.numPostiMoto,
                    numPostiFurgone : req.body.numPostiFurgone,
                    numPostiBus : req.body.numPostiBus,
                    postiOccupati: req.body.postiOccupati,
                    tariffa: req.body.tariffa
                });
                break;
            }
    }}catch(err){
        res.status(400).json({
            error: err.message
    });
    }
    
    parcheggio.save().then(result => {
        res.status(201).json({
            message: "Created Parcheggio Successfully",
            createdParcheggio:{ 
                    _id: result._id,
                    _type: result._type,
                    nome: result.nome,
                    request: {
                        type: "GET",
                        url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/:" + result._id
                    }
                }
            })}
    ).catch(err =>{
        switch(err.name){
            case "ValidationError":{
                res.status(400).json({ // Errore di database
                    error: err.message
                })
                break;
            }
            default:{
                res.status(500).json({ // Errore di database
                    error: err.message
                })
                break;
            }
        }
        
    });
};

// Funzione che implementa la chiamata PATCH a /v1/parcheggio/:parcheggioId
exports.parcheggio_patch = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1) );
        if(!mongoose.Types.ObjectId.isValid(id)){ // Controllo validità ID
            throw new Error("Wrong id") 
        }
    } catch(err){
        res.status(400).json({
            error: err.message  // formato id del parcheggio non valido
        });
        return; // Risolve "Cannot set headers after they are sent to the client"
    };
    const updateOps = {};
    validParams = ["nome", "posizione", "numPosti", "isCoperto", "statoParcheggio", "numPostiDisabili", "numPostiGravidanza", "numPostiAuto","numPostiMoto","numPostiFurgone","numPostiBus", "isDisco", "dataInizio", "dataFine","tariffa", "postiOccupati"];
    try{
        for (const ops of req.body) {   // Controllo validità parametri della richiesta
            if(ops.propName == "_type" || ops.propName == "_id"){
                throw new Error("Cant modify property");
            }
            if(!validParams.includes(ops.propName)){
                throw new Error("invalid propName field");
            }
            updateOps[ops.propName] = ops.value;
        }
    }catch(err){
        res.status(400).json({  // Errore nella richiesta
            error: err.message
        });
        return;
    }
    Parcheggio.findByIdAndUpdate(id, updateOps) // Update parcheggio
    .exec()
    .then(result => {
        res.status(200).json({
            message: " Parcheggio Modified Successfully",
            modifiedParcheggio:{ 
                _id: result._id,
                _type: result._type,
                request: {
                    type: "GET",
                    url: process.env.DEPLOY_URL + process.env.PORT + "/v1/parcheggio/:" + result._id
                }
        }});
    })
    .catch( err => {
            res.status(500).json({  // Errore ricerca o update
                error: err.message
            });
    });
}

//Funzione che implementa la chiamata DELETE a /v1/parcheggio/:parcheggioId
exports.parcheggio_delete = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1) );
        if(!mongoose.Types.ObjectId.isValid(id)){ // Controllo validità ID
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({
            error: err.message // formato id del parcheggio non valido
        });
        return; // Risolve "Cannot set headers after they are sent to the client"
    };
    Parcheggio.findByIdAndDelete(id)    // Ricerca e cancellazione
    .then(result => {
        if(result === null){    // Parcheggio non trovato
            console.log("parcheggio not found to delete")
            res.status(404).json({
                error: "parcheggio not found to delete"
            });
            return;
        }
        res.status(200).json({
            message: " Parcheggio Deleted Successfully",
            deletedParcheggio:{ 
                _id: result._id,
                _type: result._type,
                nome: result.nome
        }});
    }).catch( err => {
        res.status(500).json({  // Errore ricerca o cancellazione
            error: err.message
        });
    });
}

// Funzione che fa la richiesta per vedere tutte le prenotazioni dato un parcheggio Vigilato
exports.parcheggio_get_prenotazioni = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1));
        if(!mongoose.Types.ObjectId.isValid(id)){   // Controllo validità ID
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({ // formato id del parcheggio non valido
            error: err.message
        });
        return; // Evita l'errore "Cannot set headers after they are sent to the client" 
    };
    /* Se l'id fosse di un parcheggio non vigilato non ritorniamo nulla*/
    Prenotazione.find({parcheggioId: id})
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            prenotazioni: docs.map(doc =>{
                return {
                    _id: doc._id,
                    parcheggioId: doc.parcheggioId,
                    utenteMail : doc.utenteMail,
                    dataPrenotazione : doc.dataPrenotazione,
                    tipoPosto : doc.tipoPosto,
                    veicolo : doc.veicolo,
                    isArrived : doc.isArrived
                }
            })})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ // Find fallita
            error: err
        });
    });
};


exports.parcheggio_get_feedback = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1));
        if(!mongoose.Types.ObjectId.isValid(id)){   // Controllo validità ID
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({ // formato id del parcheggio non valido
            error: err.message
        });
        return; // Evita l'errore "Cannot set headers after they are sent to the client" 
    };
    /* Se l'id fosse di un parcheggio non vigilato non ritorniamo nulla*/
    Feedback.find({parcheggioId: id})
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            feedback: docs.map(doc =>{
                return {
                    _id: doc._id,
                    parcheggioId: doc.parcheggioId,
                    utenteMail : doc.utenteMail,
                    rating: doc.rating,
                    testoFeedback: doc.testoFeedback
                }
            })})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ // Find fallita
            error: err
        });
    });
};