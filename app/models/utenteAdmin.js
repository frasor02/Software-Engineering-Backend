const mongoose = require('mongoose');

// Schema che definisce un admin
const utenteAdminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    email: { type: String, required: true, unique: true, match: /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/ },
    password: { type: String, required: true } //, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/
}, {discriminatorKey: '_type'});

module.exports = mongoose.model('UtenteAdmin', utenteAdminSchema);