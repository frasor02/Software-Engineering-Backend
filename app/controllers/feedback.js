const mongoose = require('mongoose');
const Feedback = require('../models/feedback');
const Parcheggio = require('../models/parcheggio');
const Utente = require('../models/utente');
const jwt = require('jsonwebtoken');


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