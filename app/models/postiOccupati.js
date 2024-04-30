const mongoose = require('mongoose');

// Schema che definisce i posti occupati
const postiOccupatiSchema = new mongoose.Schema({
    postiOcc : { type: Number, required: true, min: 0 },
    postiOccDisabili : { type: Number, required: true, min: 0},
    postiOccGravidanza : { type: Number, required: true, min: 0},
    postiOccAuto : { type: Number, required: true, min: 0},
    postiOccMoto : { type: Number, required: true, min: 0},
    postiOccFurgone : { type: Number, required: true, min: 0},
    postiOccBus : { type: Number, required: true, min: 0}
  });

module.export = postiOccupatiSchema;