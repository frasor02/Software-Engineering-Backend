const mongoose = require('mongoose');

// Schema che definisce i posti occupati
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