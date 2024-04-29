const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');

const parcheggioFree = Parcheggio.discriminator("ParcheggioFree", new mongoose.Schema({
    isDisco: { type: Boolean, required: true },
    dataInizio: { type: Date, required: true },
    dataFine: { type: Date, required: true }
}));



module.exports = parcheggioFree;