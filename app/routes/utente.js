const express = require('express');
const router = express.Router();

const controllerUtente = require('../controllers/utente');

// Chiamata POST per registrare un nuovo utente
router.post('/registrazioni', controllerUtente.registrazione);

module.exports = router;