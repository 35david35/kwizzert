/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var kwizzUitvoeringSchema = Schema({
    kwizzMeestert: {
        type: Schema.Types.ObjectId, 
        ref: 'KwizzMeesterts', 
        required: true
    },
    teams: [{
            type: Schema.Types.ObjectId, 
            ref: 'Team',
            required: true
        }
    ],
    wachtwoord: {
        type: String, 
        required: true
    },
    kwizzGesloten: {
        type: Number,
        required: true
    },
    ronde: {
        type: Number,
        required: true
    },
    kwizzGestart: {
        type: Number,
        required: true
    },
    gekozenVragen: [{
        type: Schema.Types.ObjectId,
        ref: 'questions'
    }]
});

var KwizzUitvoering = mongoose.model('KwizzUitvoering', kwizzUitvoeringSchema, 'kwizzUitvoeringen');

module.exports = KwizzUitvoering;