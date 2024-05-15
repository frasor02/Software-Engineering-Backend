const app = require('./app/app.js');
const mongoose = require('mongoose');

// Il port su cui il server è in ascolto è specificato nelle variabili d'ambiente oppure di default 3000
const port = process.env.PORT || 3000;

// Configura mongoose per connettersi al server
app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});