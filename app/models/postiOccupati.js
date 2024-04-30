const mongoose = require('mongoose');

// Schema che definisce i posti occupati
const postiOccupatiSchema = new mongoose.Schema({
    postiOcc : { type: Number, required: true },
    postiOccDisabili : { type: Number, required: true},
    postiOccGravidanza : { type: Number, required: true},
    postiOccAuto : { type: Number, required: true},
    postiOccMoto : { type: Number, required: true},
    postiOccFurgone : { type: Number, required: true},
    postiOccBus : { type: Number, required: true}
  });

module.export = postiOccupatiSchema;