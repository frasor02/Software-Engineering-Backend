const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Utente = require('../models/utente');

// Funzione che implementa l'autenticazione, con la creazione di un token
exports.autenticazione = (req, res) => {
    Utente.find({ email: req.body.email })
    .exec()
    .then(utenti => {
        if (utenti.length < 1){
            return res.status(401).json({
                error: 'Autenticazione fallita'
            });
        }
        bcrypt.compare(req.body.password, utenti[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    error: 'Autenticazione fallita'
                });
            }
            if (!result) {
                console.log(utenti[0]._type);
                const token = jwt.sign(
                    {
                        _id: utenti[0]._id,
                        _type: utenti[0]._type,
                        email: utenti[0].email
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Autenticazione effettuata',
                    token: token,
                    email: utenti[0].email,
                    _id: utenti[0]._id,
                    request: {
                        type: 'GET',
                        url: process.env.DEPLOY_URL + process.env.PORT + '/v1/utente/' + utenti[0]._id
                    }
                });
            }
            return res.status(401).json({
                error: 'Autenticazione fallita'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
};