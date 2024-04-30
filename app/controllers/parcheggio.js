const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');
const ParcheggioFree = require('../models/parcheggioFree');
const ParcheggioPay = require('../models/parcheggioPay');
const ParcheggioVigilato = require('../models/parcheggioVigilato');

/*Logica delle API dirette alla risorsa parcheggi.*/

// Utility GET
exports.parcheggio_get_all = (req, res) => {
    Parcheggio.find({})
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs)
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            message: err
        })
    });
};

// Funzione che implementa la chiamata POST a /parcheggio
exports.parcheggio_post = (req, res) => {
    let parcheggio;
    try{
        if(req.body._type != "parcheggioFree" &&  req.body._type != "parcheggioPay" && req.body._type != "parcheggioVigilato"){
            throw new Error("undefined _type field");
        };
        switch(req.body._type){
            case "parcheggioFree":{
                if(req.body.isDisco){
                    if(req.body.dataInizio == undefined || req.body.dataFine == undefined){
                        throw new Error("undefined dataInizio o dataFine");
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
                        dataFine: req.body.dataFine
                    });
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
                        isDisco: req.body.isDisco,
                    });
                }
                break;
            }
            case "parcheggioPay":{
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
                });
                break;
            }
            case "parcheggioVigilato":{
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
            message: err.message
    });
    }
    console.log(parcheggio);
    parcheggio.save().then(result => {
        console.log(result);
        res.status(201).json({
            createdParcheggio: parcheggio
        });
    }).catch(err =>{
        console.log(err);
        res.status(400).json({
            message: err
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
            message: err.message
        });
    };
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Parcheggio.findByIdAndUpdate(id, updateOps)
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            message: err
        });
    });
};

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
            message: err.message
        });
    };
    Parcheggio.findByIdAndDelete(id)
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            message: err
        });
    });
}