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
    if (req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/) == null){
        return res.status(400).json({
            error: "Invalid password"
        })
    }
    let Utente;
    switch (req.body._type) {
        case 'UtenteAdmin': {
            Utente = UtenteAdmin;
            break;
        }
        case 'UtenteNormale': {
            Utente = UtenteNormale;
            break;
        }
        default: {
            return res.status(400).json({
                error: "Invalid _type field"
            });
        }
    }
    Utente.find({email: req.body.email})
    .exec()
    .then(utente => {
        if (utente.length >= 1) {
            return res.status(409).json({
                error: 'Email già esistente'
            });
        } else {
            bcrypt.hash(req.body.email, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    // Switch per utenteAdmin e utenteNormale
                    let nuovoUtente;
                    switch(req.body._type){
                        case 'UtenteAdmin':{
                            try{
                                nuovoUtente = new Utente({
                                    _id: new mongoose.Types.ObjectId(),
                                    email: req.body.email,
                                    password: hash
                                });
                            }catch{
                                console.log(err);
                                res.status(400).json({
                                    error: err
                                });
                            }
                            break;
                        }
                        case 'UtenteNormale':{
                            try{
                                nuovoUtente = new Utente({
                                    _id: new mongoose.Types.ObjectId(),
                                    email: req.body.email,
                                    password: hash,
                                    metPagamento: req.body.metPagamento,
                                    veicoli: req.body.veicoli
                                });
                            }catch(err){
                                console.log(err);
                                res.status(400).json({
                                    error: err
                                });
                            }
                            break;
                        }
                    }
                    console.log(nuovoUtente);
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
                        res.status(500).json({
                            message: "saving error",
                            error: err.message
                        });
                    });
                }
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};