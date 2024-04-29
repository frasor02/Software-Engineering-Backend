const mongoose = require('mongoose');
const Parcheggio = require('../models/parcheggio');

// Schema che rappresenta la classe Parcheggio a Pagamento
const parcheggioPay = Parcheggio.discriminator("ParcheggioPay", new mongoose.Schema({
    tariffa: { type: Number, required: true}
}));

module.exports = parcheggioPay;