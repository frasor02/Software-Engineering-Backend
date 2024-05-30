const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

const controllerFeedback = require('../controllers/feedback');

// Chiamata GET per visualizzare tutti i feedback di un utente autenticato
router.get("/", checkAuth, controllerFeedback.getFeedback);
// Chiamata POST per creare un feedback su un parcheggio
router.post("/", checkAuth, controllerFeedback.postFeedback);

module.exports = router;