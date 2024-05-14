const mongoose = require('mongoose');

// Schema che definisce un utente
const utenteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {discriminatorKey: '_type'});

module.exports = mongoose.model('Utente', utenteSchema);