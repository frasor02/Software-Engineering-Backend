const mongoose = require('mongoose');

// Schema che definisce la posizione di un punto GeoJson
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

module.export = pointSchema;