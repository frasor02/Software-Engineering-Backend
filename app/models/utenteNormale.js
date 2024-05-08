const mongoose = require('mongoose');
const Utente = require('./utenteAdmin');
const Veicolo = require('./veicolo');

const utenteNormale = Utente.discriminator('UtenteNormale', new mongoose.Schema({ // Schema che definisce un utente. Eredita i parametri di utenteAdmin.
    metPagamento: {
        type: String,
        enum: ["carta di credito", "carta di debito", "paypal"],
        required: true
    },
    veicoli: {type: [Veicolo], required: true}
}));

module.exports = utenteNormale;