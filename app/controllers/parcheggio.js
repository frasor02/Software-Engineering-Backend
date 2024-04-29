const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ParcheggioFree = require('../models/parcheggioFree');
const ParcheggioPay = require('../models/parcheggioPay');
const ParcheggioVigilato = require('../models/parcheggioVigilato');



exports.parcheggio_post = (req, res) => {
    /*const parcheggio = new Parcheggio({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        posizione: req.body.posizione,
        numPosti: req.body.numPosti,
        isCoperto: req.body.isCoperto
    })
    parcheggio.save().then(result => {
        console.log(result)
    }).catch(err => console.log(err));*/
    /*if(req.body._type == 'parcheggioFree'){
        const parcheggioFree = new ParcheggioFree({
            _id: new mongoose.Types.ObjectId(),
            nome: req.body.nome,
            posizione: req.body.posizione,
            numPosti: req.body.numPosti,
            isCoperto: req.body.isCoperto,
            isDisco: req.body.isDisco
            //add data disco
        })
        parcheggioFree.save().then(result => {
            console.log(result)
        }).catch(err => console.log(err));
    }*/
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
                    isDisco: req.body.isDisco,
                    dataInizio: NULL,
                    dataFine: NULL
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
                postiOccupati: req.body.postiOccupati,
                tariffa: req.body.tariffa
            });
            break;
        }
    };
    parcheggio.save().then(result => {
        console.log(result)
    }).catch(err => console.log(err));

    res.status(201).json({
        createdParcheggio: parcheggio
    })
};