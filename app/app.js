const express = require('express');
const app = express();
const cors = require('cors')

const parcheggioRoutes = require('./routes/parcheggio')

// Configurazione middleware di parsing
app.use(express.json());

// Lettura a schermo delle richieste
app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

// Richieste CORS
app.use(cors())

app.use('/parcheggio', parcheggioRoutes);

// Handler errore 404 NOT FOUND di default
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'NOT FOUND' });
});

module.exports = app;