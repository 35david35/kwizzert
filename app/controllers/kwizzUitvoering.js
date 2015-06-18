/* jslint node: true*/

var mongoose = require("mongoose"),
    KwizzUitvoering = mongoose.model("KwizzUitvoering"),
    KwizzMeestert = mongoose.model("KwizzMeestert"),
    Team = mongoose.model("Team");

function getKwizzMeestertId (username) {
    KwizzMeestert.findOne({username: username}, function (err, doc) {
        if (doc) {
            return doc._id;
        }
    })
}

exports.nieuweKwizz = function (req, res) {
    KwizzMeestert.findOne({gebruikersnaam: req.session.username}, function (err, doc) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            })
        }
        if (doc) {
            var nieuweKwizz = new KwizzUitvoering({
                kwizzMeestert: doc._id,
                teams: [],
                wachtwoord: req.body.wachtwoord
            })
            nieuweKwizz.save(function (err) {
                if (err) {
                    return res.send({
                        doc: null,
                        err: err
                    })
                }
                res.send({
                    doc: doc,
                    err: err,
                    meta: {}
                });
            })
        }
    });
};

exports.getKwizz = function (req, res) {
    KwizzMeestert.findOne({gebruikersnaam: req.session.username}, function (err, doc) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            })
        }
        if (doc) {
            KwizzUitvoering.findOne({kwizzMeestert: doc._id}, function (err, doc) {
                if (err) {
                    return res.send({
                        doc: null,
                        err: err
                    })
                }
                res.send({
                    doc: doc,
                    err: err
                })
            });
        }
    })
};
