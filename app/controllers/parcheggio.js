const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Parcheggio = require('../models/parcheggio');


exports.parcheggio_post = (req, res) => {
    const parcheggio = new Parcheggio({
        _id: new mongoose.Types.ObjectId(),
        nome: req.body.nome,
        posizione: req.body.posizione,
        numPosti: req.body.numPosti,
        isCoperto: req.body.isCoperto
    })
    parcheggio.save().then(result => {
        console.log(result)
    }).catch(err => console.log(err));
    res.status(201).json({
        createdParcheggio: parcheggio
    })
};