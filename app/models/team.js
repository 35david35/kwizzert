/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var teamSchema = Schema({
    naam : String,
    score : Number,
    rondePunten : Number
});

var Team = mongoose.model('Team', teamSchema, 'Teams');

module.exports = Team;