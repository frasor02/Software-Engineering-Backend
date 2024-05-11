const mongoose = require('mongoose');

const Utente = require('./utente');

// Modello che definisce un utente admin
const utenteAdmin = Utente.discriminator('UtenteAdmin', new mongoose.Schema());

module.exports = utenteAdmin;