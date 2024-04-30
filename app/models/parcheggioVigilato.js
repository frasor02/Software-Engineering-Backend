const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');
const postiOccupatiSchema = require('./postiOccupati');

// Schema che rappresenta la classe Parcheggio Contingentato
const parcheggioVigilato = Parcheggio.discriminator("ParcheggioVigila", new mongoose.Schema({
    postiOccupati: postiOccupatiSchema,
    tariffa: { type: Number, required: true}
}));

module.exports = parcheggioVigilato;