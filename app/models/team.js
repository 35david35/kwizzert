/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var teamSchema = Schema({
    naam : String,
    score : Number,
    rondPunten : Number
});

var team = mongoose.model('Team', teamSchema, 'teams');