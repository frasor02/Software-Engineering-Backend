const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');

// Schema che rappresenta la classe Parcheggio Gratuito
const parcheggioFree = Parcheggio.discriminator("ParcheggioFree", new mongoose.Schema({
    isDisco: { type: Boolean, required: true },
    dataInizio: { type: String, default: undefined },
    dataFine: { type: String, default: undefined }
}));



module.exports = parcheggioFree;