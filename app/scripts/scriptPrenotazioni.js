const ParcheggioVigilato = require("../models/parcheggioVigilato");

exports.checkPostiOccupati = (parcheggio, tipoPosto, veicolo) => {
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



exports.addPostiOccupati = (parcheggio, tipoPosto, veicolo) => {
    switch(tipoPosto){
        case "disabili":{
            let newPosti = parcheggio.postiOccupati
            newPosti.postiOccDisabili += 1 ;
            newPosti.postiOcc += 1;
            const updateOps = {"postiOccupati": newPosti};
            ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
            break;
        }
        case "gravidanza":{
            let newPosti = parcheggio.postiOccupati
            newPosti.postiOccGravidanza += 1 ;
            newPosti.postiOcc += 1;
            const updateOps = {"postiOccupati": newPosti};
            ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
            break;
        }
        case "normale":{
            switch(veicolo.tipoVeicolo){
                case "auto":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccAuto += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
                case "moto":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccMoto += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
                case "furgone":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccFurgone += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
                case "bus":{
                    let newPosti = parcheggio.postiOccupati
                    newPosti.postiOccBus += 1 ;
                    newPosti.postiOcc += 1;
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
            }
            break;
        }
    };
};

//Funzione che diminuisce di uno i posti occupati in seguito all'eliminazione di una prenotazione
exports.removePostiOccupati =  (parcheggio, tipoPosto, veicolo) =>{
    switch(tipoPosto){
        case "disabili":{
            let newPosti = parcheggio.postiOccupati
            if(newPosti.postiOccDisabili > 0){
                newPosti.postiOccDisabili -= 1 ;
            }
            if(newPosti.postiOcc > 0){
                newPosti.postiOcc -= 1 ;
            }
            const updateOps = {"postiOccupati": newPosti};
            ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
            break;
        }
        case "gravidanza":{
            let newPosti = parcheggio.postiOccupati
            if(newPosti.postiOccGravidanza > 0){
                newPosti.postiOccGravidanza -= 1 ;
            }
            if(newPosti.postiOcc > 0){
                newPosti.postiOcc -= 1 ;
            }
            const updateOps = {"postiOccupati": newPosti};
            ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
            break;
        }
        case "normale":{
            switch(veicolo.tipoVeicolo){
                case "auto":{
                    let newPosti = parcheggio.postiOccupati
                    if(newPosti.postiOccAuto > 0){
                        newPosti.postiOccAuto -= 1 ;
                    }
                    if(newPosti.postiOcc > 0){
                        newPosti.postiOcc -= 1 ;
                    }
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
                case "moto":{
                    let newPosti = parcheggio.postiOccupati
                    if(newPosti.postiOccMoto > 0){
                        newPosti.postiOccMoto -= 1 ;
                    }
                    if(newPosti.postiOcc > 0){
                        newPosti.postiOcc -= 1 ;
                    }
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
                case "furgone":{
                    let newPosti = parcheggio.postiOccupati
                    if(newPosti.postiOccFurgone > 0){
                        newPosti.postiOccFurgone -= 1 ;
                    }
                    if(newPosti.postiOcc > 0){
                        newPosti.postiOcc -= 1 ;
                    }
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
                case "bus":{
                    let newPosti = parcheggio.postiOccupati
                    if(newPosti.postiOccBus > 0){
                        newPosti.postiOccBus -= 1 ;
                    }
                    if(newPosti.postiOcc > 0){
                        newPosti.postiOcc -= 1 ;
                    }
                    const updateOps = {"postiOccupati": newPosti};
                    ParcheggioVigilato.findByIdAndUpdate(parcheggio._id, updateOps).then().catch(err => { throw(err); });
                    break;
                }
            }
            break;
        }
    };
};