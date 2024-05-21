const mongoose = require('mongoose');
const Prenotazione = require('../models/prenotazione');
const ParcheggioVigilato = require('../models/parcheggioVigilato');
const Utente = require('../models/utente');
const jwt = require('jsonwebtoken');


/*Logica delle API dirette alla risorsa prenotazione.*/
function checkPostiOccupati(tipoPosto, Veicolo){

}

//Funzione che incrementa di uno i posti occupati
function addPostiOccupati(tipoPosto, Veicolo){

}


// Funzione che fa la post di una prenotazione
exports.prenotazione_post = (req, res) =>{
    const token = req.headers.authorization.split(" ")[1];
    let utenteToken = jwt.decode(token);
    if (utenteToken._type == "UtenteAdmin"){
        console.log("Account admin cerca di prenotare");
        res.status(403).json({ // Utente Admin non può prenotare un parcheggio
            error: "Account admin cerca di prenotare"
        });
    }
    ParcheggioVigilato.find({_id : req.body.parcheggioId}).exec()
    .then(parcheggio =>{
        if(parcheggio.length == 1){
            Utente.find({email : utenteToken.email}).exec()
            .then( utente => {
                if(utente.length > 0){
                    //checkPostiOccupati(req.body.tipoPosto, utente[0].veicoli[0]);
                    let nuovaPrenotazione;
                    try{
                        nuovaPrenotazione = new Prenotazione({
                            _id : new mongoose.Types.ObjectId(),
                            parcheggioId : req.body.parcheggioId,
                            utenteMail : utente[0].email,
                            dataPrenotazione : Date.now(),
                            tipoPosto: req.body.tipoPosto,
                            veicolo: utente[0].veicoli[0]
                        })
                    }catch(err){
                        console.log(err);
                        res.status(400).json({ // Input errato
                            error: err
                        });
                    }
                    nuovaPrenotazione.save().then(
                        result => {
                            //addPostiOccupati(req.body.tipoPosto, utente[0].veicoli[0]);
                            res.status(201).json({
                                message: "Prenotazione creata",
                                prenotazioneCreata: {
                                    _id : result._id,
                                    parcheggioId : result.parcheggioId,
                                    utenteMail : result.utenteMail,
                                    dataPrenotazione : result.dataPrenotazione,
                                    tipoPosto: result.tipoPosto,
                                    veicolo: result.veicolo
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
        }else{
            console.log("Parcheggio not found");
                res.status(400).json({ // L'id parcheggio non è associato ad un solo parcheggio
                    error: "Parcheggio not found"
                });
        }
    }).catch(
        err => {
            console.log(err);
            res.status(500).json({ // Id parcheggio non corretto, find non eseguita
                error: err
            });
        }
    );
};