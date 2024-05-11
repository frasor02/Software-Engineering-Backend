const mongoose = require('mongoose');

// Schema che definisce un veicolo, con controllo fromattazione targa.
const veicoloSchema = new mongoose.Schema({
    tipoVeicolo: {
        type: String,
        enum: ["auto", "moto", "furgone", "bus"],
        required: true
    },
    targa: {type: String, required: true, match: /^[A-Z]{2,2}-[0-9]{3,3}-[A-Z]{2,2}$/}
});

module.exports = veicoloSchema;