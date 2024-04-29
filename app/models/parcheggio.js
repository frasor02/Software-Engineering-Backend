const mongoose = require('mongoose');
const pointSchema = require('./point')

// Schema che rappresenta la classe Parcheggio
const parcheggioSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true},
    nome : { type: String, required: true},
    posizione : { type: pointSchema, required: true },
    numPosti : { type: Number, required: true },
    isCoperto : { type: Boolean, required: true},
    statoParcheggio : { type: String, required: true, enum: ["Disponibile", "Non disponibile"]},
    numPostiDisabili : { type: Number, required: true},
    numPostiGravidanza : { type: Number, required: true},
    numPostiAuto : { type: Number, required: true},
    numPostiMoto : { type: Number, required: true},
    numPostiFurgone : { type: Number, required: true},
    numPostiBus : { type: Number, required: true}
}, { discriminatorKey : '_type' });

module.exports = mongoose.model('Parcheggio', parcheggioSchema);