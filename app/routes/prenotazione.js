const express = require('express');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

const controllerPrenotazione = require('../controllers/prenotazione');

router.post("/",checkAuth, controllerPrenotazione.prenotazione_post);

module.exports = router;