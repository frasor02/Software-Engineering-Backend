const express = require('express');
const router = express.Router();

const controllerParcheggio = require('../controllers/parcheggio');

// Chiamata POST per aggiungere un parcheggio
router.post('/', controllerParcheggio.parcheggio_post);

router.patch('/:parcheggioId', controllerParcheggio.parcheggio_patch);

router.delete('/:parcheggioId', controllerParcheggio.parcheggio_delete);

module.exports = router;