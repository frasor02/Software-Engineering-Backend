const express = require('express');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

const controllerPrenotazione = require('../controllers/prenotazione');

router.post("/",checkAuth, controllerPrenotazione.prenotazione_post);

router.get("/", controllerPrenotazione.prenotazione_get);

module.exports = router;