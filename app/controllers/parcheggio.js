const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');
const ParcheggioFree = require('../models/parcheggioFree');
const ParcheggioPay = require('../models/parcheggioPay');
const ParcheggioVigilato = require('../models/parcheggioVigilato');

/*Logica delle API dirette alla risorsa parcheggi.*/

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
    const id = req.params.parcheggioId;
    //implementazione con switch
    //Parcheggio.updateOne({_id: id}, { $set: {nome: req.body.newNome}})
    /*.exec()
    .then(res=>{res.status(200).json({message:"OK"})})
    .catch();*/
};

//Funzione che implementa la chiamata DELETE a /parcheggio/:parcheggioId
exports.parcheggio_delete = (req, res) => {
    const id = req.params.parcheggioId;
}