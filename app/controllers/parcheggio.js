const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');
const ParcheggioFree = require('../models/parcheggioFree');
const ParcheggioPay = require('../models/parcheggioPay');
const ParcheggioVigilato = require('../models/parcheggioVigilato');

/*Logica delle API dirette alla risorsa parcheggi.*/

function findRicerca(res, long, lat, isCoperto, disabili, gravidanza, auto, moto, furgone, bus){
    Parcheggio.find(
        {
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
                    $geometry: { type: "Point",  coordinates: [ long, lat ] }

                }
            }
        }
        
    )
    .then(
       docs => {
            console.log(docs);
            res.status(200).json(
                {
                    "parcheggi": docs
                }
            );
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

//
exports.parcheggio_ricerca = (req, res) => {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let isCoperto = req.query.isCoperto;
    let utente = req.query.utente;
    let veicolo = req.query.veicolo;
    console.log(lat, long);
    console.log(isCoperto);
    console.log(utente);
    console.log(veicolo);
    
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

//Funzione che implementa la chiamata GET a /parcheggio/:parcheggioId
exports.parcheggio_get = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1) );
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({
            error: err.message
        });
    };
    Parcheggio.findById(id).select("_type _id nome posizione type coordinates numPosti isCoperto statoParcheggio numPostiDisabili numPostiGravidanza numPostiAuto numPostiMoto numPostiFurgone numPostiBus isDisco dataInizio dataFine tariffa postiOccupati")
    .then(
        doc => {
            res.status(200).json({
                "res": doc
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

// Funzione che implementa la chiamata GET a /parcheggio
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
        res.status(500).json({
            error: err
        })
    });
};

// Funzione che implementa la chiamata POST a /parcheggio
exports.parcheggio_post = (req, res) => {
    let parcheggio;
    try{
        if(req.body._type != "ParcheggioFree" &&  req.body._type != "ParcheggioPay" && req.body._type != "ParcheggioVigilato"){
            throw new Error("undefined _type field");
        };
        switch(req.body._type){
            case "ParcheggioFree":{
                if(req.body.isDisco){
                    if(req.body.dataInizio == undefined || req.body.dataFine == undefined){
                        throw new Error("undefined dataInizio o dataFine");
                    }
                    console.log(req.body.dataInizio);
                    try{
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
                    }catch(err){                       
                        res.status(400).json({
                            error: err.message
                        });
                    };
                } else{
                    try{
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
                    })}catch(err){
                        res.status(400).json({
                            error: err.message
                        })
                    };;
                }
                break;
            }
            case "ParcheggioPay":{
                try{
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
                        tariffa: req.body.tariffa
                })}catch(err){
                    res.status(400).json({
                        error: err.message
                    })
                };
                break;
            }
            case "ParcheggioVigilato":{
                try{
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
                    })
                }catch(err) {
                    res.status(400).json({
                        error: err.message
                    })
                };
                break;
            }
    }}catch(err){
        res.status(400).json({
            error: err.message
    });
    }
    console.log(parcheggio);
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
        console.log(err);
        res.status(500).json({
            error: err.message
    })});
};

// Funzione che implementa la chiamata PATCH a /parcheggio/:parcheggioId
exports.parcheggio_patch = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1) );
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({
            error: err.message
        });
    };
    const updateOps = {};
    try{
        for (const ops of req.body) {
            if(ops.propName == "_type" || ops.propName == "_id"){
                throw new Error("Cant modify property");
            }
            updateOps[ops.propName] = ops.value;
        }
    }catch(err){
        res.status(400).json({
            error: err.message
        });
    }
    Parcheggio.findByIdAndUpdate(id, updateOps)
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
            res.status(500).json({
                error: err.message
            });
    });
}

//Funzione che implementa la chiamata DELETE a /parcheggio/:parcheggioId
exports.parcheggio_delete = (req, res) => {
    let id;
    try {
        id = mongoose.Types.ObjectId( req.params.parcheggioId.substr(1) );
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error("Wrong id")
        }
    } catch(err){
        res.status(400).json({
            error: err.message
        });
    };
    Parcheggio.findByIdAndDelete(id)
    .exec()
    .then(result => {
        res.status(200).json({
            message: " Parcheggio Deleted Successfully",
            deletedParcheggio:{ 
                _id: result._id,
                _type: result._type,
                nome: result.nome
        }});
    }).catch( err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

