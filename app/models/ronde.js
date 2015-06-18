/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var rondeSchema = Schema({
    categorie : [String],
    vraagtekst : [String],
    status : Boolean,
    ingezonden : [{
        tekst : String
        //teams : Schema.Types.ObjectId
    }]
});

var Ronde = mongoose.model('Ronde', rondeSchema, 'Rondes');

module.exports = Ronde;