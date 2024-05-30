const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UtenteAdmin = require('../models/utenteAdmin');
const UtenteNormale = require('../models/utenteNormale');


/* 
Funzione che implementa la registrazione di un utente tramite una POST a /registrazione.
La password viene salvata nel database dopo un algoritmo di hash della libreria bcrypt.
L'utente non viene registrato se l'email è già presente nel db.
*/
exports.registrazione = (req, res) => {
    // Controllo che ci siano email e password
    if(req.body.email === undefined){
        res.status(400).json({error: "Missing email"});
        return;
    }
    if(req.body.password === undefined){
        res.status(400).json({error: "Missing password"});
        return;
    }

    let Utente;
    switch (req.body._type) {
        case 'UtenteAdmin': {
            Utente = UtenteAdmin;
            break;
        }
        case 'UtenteNormale': {
            Utente = UtenteNormale;
            const validMetPagamento = ['paypal', 'carta di credito', 'carta di debito'];
            if (!validMetPagamento.includes(req.body.metPagamento)){ // Controllo input prima di salvare il dato
                res.status(400).json({error: "Invalid metPagamento"});
                return;
            }
            break;
        }
        default: {
            return res.status(400).json({
                error: "Invalid _type field"
            });
        }
    }
    Utente.find({email: req.body.email})
    .then(utente => {
        if (utente.length >= 1) {
            return res.status(409).json({
                error: 'Email già esistente'
            });
        } else {
            // Creazione hash password
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err // Errore hashing della password
                    });
                } else {
                    // Switch per utenteAdmin e utenteNormale
                    let nuovoUtente;
                    switch(req.body._type){
                        case 'UtenteAdmin':{
                            nuovoUtente = new Utente({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });
                            break;
                        }
                    case 'UtenteNormale':{
                            nuovoUtente = new Utente({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash,
                                metPagamento: req.body.metPagamento,
                                veicoli: req.body.veicoli
                            });
                            break;
                        }
                    }
                    console.log(nuovoUtente);
                    // Salvataggio in db
                    nuovoUtente
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "Utente creato",
                            utenteCreato: {
                                _type: result._type,
                                email: result.email
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({ // Errore salvataggio
                            error: err.message
                        });
                    });
                }
            });
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ // Errore ricerca utente
            error: err
        });
    });
};