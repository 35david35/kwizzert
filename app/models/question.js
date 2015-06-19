/*jslint node:true nomen:true*/
var mongoose = require('mongoose'), Schema = mongoose.Schema;

var questionSchema = Schema({
    tekst: String,
    antwoord: String,
    categorie: String
});

var Question = mongoose.model('Question', questionSchema, 'questions');

module.exports = Question;