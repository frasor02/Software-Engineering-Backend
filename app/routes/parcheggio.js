const express = require('express');
const router = express.Router();

const controllerParcheggio = require('../controllers/parcheggio');

// Chiamata POST per aggiungere un parcheggio
router.post('/', controllerParcheggio.parcheggio_post);

module.exports = router;