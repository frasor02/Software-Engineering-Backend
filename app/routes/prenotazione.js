const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

const controllerPrenotazione = require('../controllers/prenotazione');

router.post("/",checkAuth, controllerPrenotazione.prenotazione_post);

router.get("/",checkAuth, controllerPrenotazione.prenotazione_get);

router.get("/:parcheggioId", checkAuth,checkAdmin, controllerPrenotazione.prenotazione_get_parcheggioId);

router.delete("/:prenotazioneId", checkAuth, controllerPrenotazione.prenotazione_delete);

module.exports = router;