const express = require('express');
const router = express.Router();

const controllerToken = require('../controllers/token');

// Chiamata POST per registrare un nuovo utente
router.post('/', controllerToken.autenticazione);

module.exports = router;