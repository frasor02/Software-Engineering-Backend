const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utente = require('../models/utenteAdmin');
// ereditarietà?

/* 
Funzione che implementa la registrazione di un utente tramite una POST a /registrazione.
La password viene salvata nel database dopo un algoritmo di hash della libreria bcrypt.
L'utente non viene registrato se l'email è già presente nel db.
*/
exports.registrazione = (req, res) => {
    Utente.find({email: req.body.email})
    .exec()
    .then(utente => {
        if (utente.length >= 1) {
            return res.status(409).json({
                message: 'Email già esistente'
            });
        } else {
            bcrypt.hash(req.body.email, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new Utente({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        eta: req.body.eta,
                        metPagamento: req.body.metPagamento
                    });
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
    });
};