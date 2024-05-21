const mongoose = require('mongoose');
const Prenotazione = require('../models/prenotazione');
const ParcheggioVigilato = require('../models/parcheggioVigilato');
const Utente = require('../models/utente');
const jwt = require('jsonwebtoken');


/*Logica delle API dirette alla risorsa prenotazione.*/
function checkPostiOccupati(parcheggio, tipoPosto, veicolo){
    switch(tipoPosto){
        case "disabili":{
            if (parcheggio.postiOccupati.postiOccDisabili == parcheggio.numPostiDisabili){
                throw("Posti disabili non disponibili")
            }
            break;
        }
        case "gravidanza":{
            if (parcheggio.postiOccupati.postiOccGravidanza == parcheggio.numPostiGravidanza){
                throw("Posti gravidanza non disponibili");
            }
            break;
        }
        case "normale":{
            switch(veicolo.tipoVeicolo){
                case "auto":{
                    if (parcheggio.postiOccupati.postiOccAuto == parcheggio.numPostiAuto){
                        throw("Posti auto non disponibili");
                    }
                    break;
                }
                case "moto":{
                    if (parcheggio.postiOccupati.postiOccMoto == parcheggio.numPostiMoto){
                        throw("Posti moto non disponibili");
                    }
                    break;
                }
                case "furgone":{
                    if (parcheggio.postiOccupati.postiOccFurgone == parcheggio.numPostiFurgone){
                        throw("Posti bus non disponibili")
                    }
                    break;
                }
                case "bus":{
                    if (parcheggio.postiOccupati.postiOccBus == parcheggio.numPostiBus){
                        throw("Posti bus non disponibili");
                    }
                    break;
                }
            }
            break;
        }
    };
};

//Funzione che incrementa di uno i posti occupati in seguito ad una prenotazione
function addPostiOccupati(parcheggio, tipoPosto, veicolo){
    switch(tipoPosto){
        case "disabili":{
            let newPosti = parcheggio.postiOccupati
            newPosti.postiOccDisabili += 1 ;
            newPosti.postiOcc += 1;
            const updateOps = {"postiOccupati": newPosti};
            ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).exec().then().catch(err => { throw(err); });
            break;
        }
        case "gravidanza":{
            let newPosti = parcheggio.postiOccupati
            newPosti.postiOccGravidanza += 1 ;
            newPosti.postiOcc += 1;
            const updateOps = {"postiOccupati": newPosti};
            ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).exec().then().catch(err => { throw(err); });
            break;
        }
        case "normale":{
            switch(veicolo.tipoVeicolo){
                case "auto":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccAuto += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).exec().then().catch(err => { throw(err); });
                    break;
                }
                case "moto":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccMoto += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).exec().then().catch(err => { throw(err); });
                    break;
                }
                case "furgone":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccFurgone += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).exec().then().catch(err => { throw(err); });
                    break;
                }
                case "bus":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccBus += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).exec().then().catch(err => { throw(err); });
                    break;
                }
            }
            break;
        }
    };
};


// Funzione che fa la post di una prenotazione
exports.prenotazione_post = (req, res) =>{
    const token = req.headers.authorization.split(" ")[1];
    const utenteToken = jwt.decode(token);
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
                    try{
                        checkPostiOccupati(parcheggio[0], req.body.tipoPosto, utente[0].veicoli[0]);
                    } catch(err){
                        console.log(err);
                        res.status(400).json({ // Non ci sono i posti
                            error: err
                        });
                        return; // Per impedire di continuare l'esecuzione che interromperebbe il server
                    }
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
                            try{
                                addPostiOccupati(parcheggio[0], req.body.tipoPosto, utente[0].veicoli[0]);
                            }catch(err){
                                console.log(err);
                                res.status(500).json({ // Non si è riusciti ad aggiornare
                                    error: err
                                });
                                return; // Per impedire di continuare l'esecuzione che interromperebbe il server
                            }
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

// Funzione che fa la richiesta per vedere tutte le prenotazioni dato un parcheggio Vigilato
exports.prenotazione_get_parcheggioId = (req,res) => {

};

// Funzione che fa la richiesta per vedere tutte le prenotazioni dato utente
exports.prenotazione_get= (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const utenteToken = jwt.decode(token);
    Prenotazione.find({utenteMail: utenteToken.email})
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            prenotazioni: docs.map(doc =>{
                return {
                    _id: doc._id,
                    parcheggioId: doc.parcheggioId,
                    utenteMail : doc.utenteMail,
                    dataPrenotazione : doc.dataPrenotazione,
                    tipoPosto : doc.tipoPosto,
                    veicolo : doc.veicolo
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

// Funzione che fa la richiesta per eliminare una prenotazione
exports.prenotazione_delete= (req,res) => {
    
};