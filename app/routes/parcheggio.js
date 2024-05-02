const express = require('express');
const router = express.Router();

const controllerParcheggio = require('../controllers/parcheggio');

//Chiamata GET per visualizzare un parcheggio
router.get('/:parcheggioId', controllerParcheggio.parcheggio_get);

// Chiamata GET per visualizzare tutti i parcheggi
router.get('/', controllerParcheggio.parcheggio_get_all);

// Chiamata POST per aggiungere un parcheggio
router.post('/', controllerParcheggio.parcheggio_post);

// Chiamata PATCJ che modifica gli attributi di un patcheggio
router.patch('/:parcheggioId', controllerParcheggio.parcheggio_patch);

// Chiamata DELETE per eliminare un parcheggio
router.delete('/:parcheggioId', controllerParcheggio.parcheggio_delete);

module.exports = router;