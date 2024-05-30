const mongoose = require('mongoose');
const pointSchema = require('./point')

// Schema che rappresenta la classe Parcheggio
/*Un parcheggio ha un certo numero di posti che è ottenuto dalla somma delle proprietà:
numPostiDisabili + numPostiGravidanza + numPostiAuto + numPostiMoto + numPostiFurgone + numPostiBus
Si è assunto in progettazione che i postiDisabili e i postiGravidanza siano postiAuto però per quelle determinate categtorie.
Quindi i posti per le auto totali di un parcheggio sarebbero dati da numPostiDisabili + numPostiGravidanza + numPostiAuto
*/
const parcheggioSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true}, // _id parcheggio in db
    nome : { type: String, required: true},
    posizione : { type: pointSchema, required: true }, // posizione (latitudine e longitudine)
    numPosti : { type: Number, required: true, min: 1, get: v => Math.round(v),set: v => Math.round(v) }, // posti totali
    isCoperto : { type: Boolean, required: true}, // parcheggio coperto o meno
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