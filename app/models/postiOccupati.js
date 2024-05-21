const mongoose = require('mongoose');

// Schema che definisce i posti occupati
/*Vedi le assunzioni sulle tipologie di posti sul file models/parcheggio.js.
Si assume per i seguenti che:
postiOcc <=  numPosti, postiOccDisabili <= numPostiDisabili e così via per tutte le tipologie di posti.*/
const postiOccupatiSchema = new mongoose.Schema({
    postiOcc : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v) },
    postiOccDisabili : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    postiOccGravidanza : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    postiOccAuto : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    postiOccMoto : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    postiOccFurgone : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)},
    postiOccBus : { type: Number, required: true, min: 0, get: v => Math.round(v),set: v => Math.round(v)}
  });

module.export = postiOccupatiSchema;