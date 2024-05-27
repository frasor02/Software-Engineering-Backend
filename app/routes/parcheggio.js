const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

const controllerParcheggio = require('../controllers/parcheggio');

//Chiamata GET per visualizzare parcheggi vicini alla meta inserita
router.get('/ricerca', controllerParcheggio.parcheggio_ricerca);

// Chiamata GET per visualizzare le prenotazioni dato un parcheggio
router.get("/:parcheggioId/prenotazione", checkAuth,checkAdmin, controllerParcheggio.parcheggio_get_prenotazioni);

//Chiamata GET per visualizzare un parcheggio
router.get('/:parcheggioId', controllerParcheggio.parcheggio_get);

// Chiamata GET per visualizzare tutti i parcheggi
router.get('/', controllerParcheggio.parcheggio_get_all);

// Chiamata POST per aggiungere un parcheggio
router.post('/', checkAuth, checkAdmin, controllerParcheggio.parcheggio_post);

// Chiamata PATCH che modifica gli attributi di un patcheggio
router.patch('/:parcheggioId', checkAuth, checkAdmin, controllerParcheggio.parcheggio_patch);

// Chiamata DELETE per eliminare un parcheggio
router.delete('/:parcheggioId',checkAuth, checkAdmin, controllerParcheggio.parcheggio_delete);

//Chiamata GET per vedere i feedback dato un parcheggio
router.get("/:parcheggioId/feedback", controllerParcheggio.parcheggio_get_feedback);



module.exports = router;