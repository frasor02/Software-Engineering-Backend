const mongoose = require('mongoose');

/* Schema che rappresenta la classe Prenotazione. Modella la prenotazione di un utente su un parcheggio vigliato.*/
const prenotazioneSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true }, // _id nel Database di una prenotazione
    parcheggioId : { type: mongoose.Schema.Types.ObjectId, required: true }, // id del ParcheggioVigilato prenotato
    utenteMail : { type: String, required: true }, // email dell'utente che ha prenotato
    rating: {type: Number, required: true, min: 0, max: 5, get: v => Math.round(v),set: v => Math.round(v)}, //voto feedback
    testoFeedback: {type: String, required: true, max: 300} //commento feedback
});

module.exports = mongoose.model('Prenotazione', prenotazioneSchema);