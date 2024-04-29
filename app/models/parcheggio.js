const mongoose = require('mongoose');
const pointSchema = require('./point')

const parcheggioSchema = mongoose.Schema({
    _id : { type: mongoose.Schema.Types.ObjectId, required: true},
    nome : { type: String, required: true},
    posizione : { type: pointSchema, required: true },
    numPosti : { type: Number, required: true },
    isCoperto : { type: Boolean, required: true}
});

module.exports = mongoose.model('Parcheggio', parcheggioSchema);