const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');

// Schema che rappresenta la classe Parcheggio Pontingentato
const parcheggioVigilato = Parcheggio.discriminator("ParcheggioVigila", new mongoose.Schema({
    postiOccupati: { type: Number, required: true},
    tariffa: { type: Number, required: true}
}));

module.exports = parcheggioVigilato;