const mongoose = require('mongoose');
const Veicolo = require('./veicolo');


/* Schema che rappresenta la classe Prenotazione. Modella la prenotazione di un utente su un parcheggio vigliato.*/
const prenotazioneSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true }, // _id nel Database di una prenotazione
    parcheggioId : { type: mongoose.Schema.Types.ObjectId, required: true }, // id del ParcheggioVigilato prenotato
    utenteMail : { type: String, required: true }, // email dell'utente che ha prenotato
    dataPrenotazione : { type: Date, required: true}, // data di prenotazione
    tipoPosto: {type: String,
        enum: ["normale", "disabili", "gravidanza"],
        required: true},
    veicolo: {type: Veicolo, required: true}
});

module.exports = mongoose.model('Prenotazione', prenotazioneSchema);