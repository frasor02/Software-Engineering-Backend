const mongoose = require('mongoose');

// Schema che definisce un utente
const utenteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },  // _id nel database di un utente
    email: { type: String, required: true, unique: true }, // email dell'utente
    password: { type: String, required: true }  // password dell'utente
}, {discriminatorKey: '_type'});

module.exports = mongoose.model('Utente', utenteSchema);