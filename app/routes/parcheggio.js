const express = require('express');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

const controllerParcheggio = require('../controllers/parcheggio');

//Chiamata GET per visualizzare parcheggi vicini alla meta inserita
router.get('/ricerca', controllerParcheggio.parcheggio_ricerca);

//Chiamata GET per visualizzare un parcheggio
router.get('/:parcheggioId', controllerParcheggio.parcheggio_get);

// Chiamata GET per visualizzare tutti i parcheggi
router.get('/', controllerParcheggio.parcheggio_get_all);

// Chiamata POST per aggiungere un parcheggio
router.post('/', checkAuth, controllerParcheggio.parcheggio_post);

// Chiamata PATCJ che modifica gli attributi di un patcheggio
router.patch('/:parcheggioId', checkAuth, controllerParcheggio.parcheggio_patch);

// Chiamata DELETE per eliminare un parcheggio
router.delete('/:parcheggioId',checkAuth, controllerParcheggio.parcheggio_delete);

module.exports = router;