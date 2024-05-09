const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utente = require('../models/utenteAdmin');

/* 
Funzione che implementa la registrazione di un utente tramite una POST a /registrazione.
La password viene salvata nel database dopo un algoritmo di hash della libreria bcrypt.
L'utente non viene registrato se l'email è già presente nel db.
*/
exports.registrazione = (req, res) => {
    if(req.body._type != "UtenteAdmin" && req.body._type != "UtenteNormale"){
        return res.status(400).json({
            error: "_type field undefined"
        });
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
                    let user;
                    switch(req.body._type){
                        case 'UtenteAdmin':{
                            try{
                                user = new Utente({
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
                                user = new Utente({
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
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: "Utente creato"
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
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