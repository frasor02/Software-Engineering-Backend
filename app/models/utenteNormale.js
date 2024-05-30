const mongoose = require('mongoose');
const Utente = require('./utente');
const Veicolo = require('./veicolo');

const utenteNormale = Utente.discriminator('UtenteNormale', new mongoose.Schema({ // Schema che definisce un utente normale. Eredita i parametri di Utente.
    metPagamento: { // metodo di pagamento selezionato dall'utente (è necessario in fase di registrazione)
        type: String,
        enum: ["carta di credito", "carta di debito", "paypal"],
        required: true
    },
    veicoli: {type: [Veicolo], required: true} // Lista di veicoli
}));

module.exports = utenteNormale;