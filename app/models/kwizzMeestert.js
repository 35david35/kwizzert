var mongoose = require('mongoose'), Schema = mongoose.Schema;

var kwizzMeestertSchema = Schema({
    gebruikersnaam : String,
    wachtwoord : String
});

var KwizzMeestert = mongoose.model('KwizzMeestert', kwizzMeestertSchema, 'KwizzMeesterts');

module.exports = KwizzMeestert;