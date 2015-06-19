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
    });
}

exports.getQuiz = function (req, res) {
    KwizzUitvoering.findOne({ _id: req.session.quiz }, function(err, doc){
        if(err) {
            res.send({
                doc: null,
                err: err
            });
        }
        
        res.send({            
            doc: doc,
            err: null
        });        
    });
};

exports.getKwizz = function (req, res) {
    KwizzMeestert.findOne({gebruikersnaam: req.session.username}, function (err, doc) {
        if (err) {
            return res.send({
                doc: null,
                err: err
            });
        }
        if (doc) {
            KwizzUitvoering.findOne({kwizzMeestert: doc._id}, function (err, doc) {
                if (err) {
                    return res.send({
                        doc: null,
                        err: err
                    });
                }
                res.send({
                    doc: doc,
                    err: err
                });
            });
        }
    });
};