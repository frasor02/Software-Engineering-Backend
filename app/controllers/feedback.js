const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const Parcheggio = require('../models/parcheggio');
const Utente = require('../models/utente');
const jwt = require('jsonwebtoken');

// Funzione che fa la get di un feedback
exports.getFeedback = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const utenteToken = jwt.decode(token);
    Feedback.find({utenteMail: utenteToken.email})
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            feedback: docs.map(doc =>{
                return {
                    _id: doc._id,
                    parcheggioId: doc.parcheggioId,
                    utenteMail : doc.utenteMail,
                    rating: doc.rating,
                    testoFeedback: doc.testoFeedback
                }
            })})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ // Find fallita
            error: err
        });
    });

};

// Funzione che fa la post di un feedback
exports.postFeedback = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const utenteToken = jwt.decode(token);
    
    Parcheggio.find({_id : req.body.parcheggioId})
    .then(parcheggio => {
        if(parcheggio.length == 1){
            Utente.find({email : utenteToken.email})
            .then( utente => {
                if(utente.length > 0){
                    let nuovoFeedback = new Feedback({
                        _id : new mongoose.Types.ObjectId(),
                        parcheggioId : req.body.parcheggioId,
                        utenteMail : utente[0].email,
                        rating: req.body.rating,
                        testoFeedback: req.body.testoFeedback
                    })
                    
                    nuovoFeedback.save().then(
                        result => {
                            res.status(201).json({
                                message: "Feedback creato",
                                createdFeedback: {
                                    _id : result._id,
                                    parcheggioId : result.parcheggioId,
                                    rating: result.rating,
                                    testoFeedback: result.testoFeedback
                                }})}
                    ).catch(err => {
                        console.log(err);
                        res.status(500).json({ // Errore database non ha salvato il parcheggio
                            error: err
                        });
                    });
                }else{
                    console.log("Email not found");
                    res.status(400).json({ // L'email non è associato ad un solo utente
                        error: "Email not found"
                    });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ // L'email utente non è corretta, find non eseguita
                    error: err
                });
            })
        } else{
            console.log("parcheggio non trovato");
            res.status(400).json({ // parcheggio non trovato
                error: "parcheggio non trovato"
            });  
            return ; 
        }

    }

    ).catch(
        err => {
            console.log(err);
            res.status(500).json({ // Id parcheggio non corretto, find non eseguita
                error: err
            });
        }
    );

};