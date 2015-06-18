/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var vraag = Schema({
    tekst : String,
    antwoord : String,
    categorie : String
});

var ronde = mongoose.model('Vraag', vraag, 'Vragen'); 