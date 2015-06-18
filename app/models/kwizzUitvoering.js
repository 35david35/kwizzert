var mongoose = require('mongoose')
    , Schema = mongoose.Schema

var kwizzUitvoeringSchema = Schema({
    kwizzMeestert: {type: Schema.Types.ObjectId, ref: 'KwizzMeesterts', required: true},
    teams: [{type: Schema.Types.ObjectId, ref: 'teams', required: true}],
    wachtwoord: {type: String, required: true}
});

var KwizzUitvoering = mongoose.model('KwizzUitvoering', kwizzUitvoeringSchema, 'kwizzUitvoeringen');

module.exports = KwizzUitvoering;