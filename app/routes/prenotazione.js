const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

const controllerPrenotazione = require('../controllers/prenotazione');

// Chiamata POST per salvare una nuova prenotazione. Solamente un UtenteNormale può prenotare.
router.post("/",checkAuth, controllerPrenotazione.prenotazione_post);

// Chiamata GET per visualizzare tutte le prenotazioni di un utente
router.get("/",checkAuth, controllerPrenotazione.prenotazione_get);

// Chiamata DELETE per annullare una prenotazione. PUò essere fatto da admin o da chi ha prenotato.
router.delete("/:prenotazioneId", checkAuth, controllerPrenotazione.prenotazione_delete);

// Chiamata PATCH per modificare la proprietà "isArrived" di una prenotazione
router.patch("/:prenotazioneId/arrivo",  checkAuth,checkAdmin, controllerPrenotazione.prenotazione_patch);

module.exports = router;