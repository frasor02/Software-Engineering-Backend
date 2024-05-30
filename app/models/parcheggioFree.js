const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');

// Schema che rappresenta la classe Parcheggio Gratuito
const parcheggioFree = Parcheggio.discriminator("ParcheggioFree", new mongoose.Schema({
    isDisco: { type: Boolean, required: true }, // parcheggio con disco orario o meno
    dataInizio: { type: String, match: /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/ }, // se c'è il disco orario, definisce da quando è necessario
    dataFine: { type: String, match: /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/ } // se c'è il disco orario, definisce fino a quando è necessario
}));



module.exports = parcheggioFree;