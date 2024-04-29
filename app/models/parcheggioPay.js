const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');

const parcheggioPay = Parcheggio.discriminator("ParcheggioPay", new mongoose.Schema({
    tariffa: { type: Number, required: true}
}));

module.exports = parcheggioPay;