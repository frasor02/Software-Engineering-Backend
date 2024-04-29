const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ParcheggioFree = require('../models/parcheggioFree');
const ParcheggioPay = require('../models/parcheggioPay');
const ParcheggioVigilato = require('../models/parcheggioVigilato');

/*Logica delle API dirette alla risorsa parcheggi.*/

// Funzione che implementa la chiamata POST a /parcheggio
exports.parcheggio_post = (req, res) => {
    let parcheggio;
    switch(req.body.p){
        case "parcheggioFree":{
            if(req.body.isDisco){
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
    };
    //da sistemare
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