const mongoose = require('mongoose');
const pointSchema = require('./point')

// Schema che rappresenta la classe Parcheggio
const parcheggioSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true},
    nome : { type: String, required: true},
    posizione : { type: pointSchema, required: true },
    numPosti : { type: Number, required: true, min: 1 },
    isCoperto : { type: Boolean, required: true},
    statoParcheggio : { type: String, required: true, enum: ["Disponibile", "Non disponibile"]},
    numPostiDisabili : { type: Number, required: true, min: 1},
    numPostiGravidanza : { type: Number, required: true, min: 1},
    numPostiAuto : { type: Number, required: true, min: 1},
    numPostiMoto : { type: Number, required: true, min: 1},
    numPostiFurgone : { type: Number, required: true, min: 1},
    numPostiBus : { type: Number, required: true, min: 1}
}, { discriminatorKey : '_type' });

module.exports = mongoose.model('Parcheggio', parcheggioSchema);