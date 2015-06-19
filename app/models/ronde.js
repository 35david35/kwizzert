/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var rondeSchema = Schema({
    kwizzUitvoering: {type: Schema.Types.ObjectId, ref: 'KwizzUitvoering'},
    nummer: Number,
    categorie : [String],
    vraagtekst : [String],
    status : Boolean,
    ingezonden : [{
        tekst : String,
        team : { 
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }
    }]
});

var Ronde = mongoose.model('Ronde', rondeSchema, 'Rondes');

module.exports = Ronde;