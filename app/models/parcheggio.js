const mongoose = require('mongoose');
const pointSchema = require('./point')

// Schema che rappresenta la classe Parcheggio
const parcheggioSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true},
    nome : { type: String, required: true},
    posizione : { type: pointSchema, required: true },
    numPosti : { type: Number, required: true, min: 1, get: v => Math.round(v),set: v => Math.round(v) },
    isCoperto : { type: Boolean, required: true},
    statoParcheggio : { type: String, required: true, enum: ["Disponibile", "Non disponibile"]},
    numPostiDisabili : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    numPostiGravidanza : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    numPostiAuto : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    numPostiMoto : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    numPostiFurgone : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    numPostiBus : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)}
}, { discriminatorKey : '_type' });

parcheggioSchema.index({ posizione: "2dsphere" });
module.exports = mongoose.model('Parcheggio', parcheggioSchema);