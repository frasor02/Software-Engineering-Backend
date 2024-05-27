const Prenotazione = require("../models/prenotazione");
const ParcheggioVigilato = require("../models/parcheggioVigilato");
const scriptPrenotazioni = require("../scripts/scriptPrenotazioni");
/* Middleware che controlla le prenotazioni scadute. Il tempo di scadenza delle prenotazioni è stato deciso per un'ora.
Gestiamo anche l'arrivo di un utente o meno con una variabile booleana che viene settata a True da una patch
da parte di un utente admin. Se l'utente è arrivato non diminuisco i posti occupati altrimenti lo diminuisco di uno.*/


var waitTime = 60*60*1000; // 1 ora in millisecondi
var lastRequestTime = new Date();
lastRequestTime.setTime(new Date().getTime + waitTime);
module.exports = (req, res, next) => {
    var now = new Date();
    if(now.getTime() - lastRequestTime.getTime() <= waitTime){
        // Il tempo non è ancora passato aspetta.
    }else{ // Eseguiamo la pulizia delle prenotazioni scadute
        cleanExpired(res); // Eseguiamo la funzione di pulizia
        lastRequestTime = new Date();
    }
    next(); // Andiamo a rispondere alla richiesta.
};

var expirationTime = 60*60*1000; // Tempo di scadenza
function cleanExpired(res){
    let onHourBefore = new Date();
    onHourBefore.setTime(onHourBefore.getTime() -  expirationTime); // Prendiamo un'ora fa.
    //fai la find e se va bene fai la deletemany
    //controlla se è arrivato se non è arrivato diminuisci di uno i posti
    Prenotazione.find({dataPrenotazione : {$lt: onHourBefore}}).then(
        (docs) => {
            if(docs.length == 0){
                console.log("Nessuna prenotazione da pulire")
                return;
            } else {
                Prenotazione.deleteMany({dataPrenotazione : {$lt: onHourBefore}}).then(
                    (result) => {
                        for(let i = 0; i < docs.length; i++){
                            if(!docs[i].isArrived){
                                ParcheggioVigilato.findById(docs[i].parcheggioId)
                                .then((park) => {
                                    scriptPrenotazioni.removePostiOccupati(park, docs[i].tipoPosto, docs[i].veicolo);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(500).json({ // Errore nella find
                                        error: err
                                })});
                            }
                        }

                    }
                ).catch( (err) => {
                    console.log(err);
                    res.status(500).json({ // Errore nella delete
                        error: err
                    });
                });
            }
        }
    ).catch( (err) => {
        console.log(err);
        res.status(500).json({ // Errore nella find
            error: err
        });
    });
    
}