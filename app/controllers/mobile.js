var mongoose = require('mongoose'),
    Team = mongoose.model('Team'),
    Quiz = mongoose.model('KwizzUitvoering'),
    KwizzMeestert = mongoose.model('KwizzMeestert');

exports.checkQuizId = function(req, res) {
    'use strict';

    Quiz.findOne({wachtwoord : req.body.quizid}, function(err, doc) {
        if (err) {
            return res.send({
                err: err
            });
        }
        if (doc) {
            if(doc.kwizzGesloten) {
                console.log("ERROR: Kwizz already ended");
                return res.send({
                    err: "ERROR: Kwizz already ended"
                })
            }
            req.session.wachtwoord = doc.wachtwoord;
            req.session.quiz = doc._id;
            res.send({
                result: doc
            });
        }
    });
};

exports.registerName = function(req, res) {
    'use strict';

    Team.find({naam: req.body.name}, function (err, teams) {
        if (teams.length) {
            return res.send({
                err: "Team bestaat al, kies een andere naam!",
                errType: 1
            })
        }
        if(!req.body.name) {
            return res.send({
                err: "Team naam mag niet leeg zijn!",
                errType: 1
            })
        }
        var t1 = new Team({
            naam : req.body.name,
            score : 0,
            rondePunten : 0
        });

        t1.save(function(err, doc) {
            if(err) {
                return err;
            }

            if(doc) {
                req.session.team = doc;
                req.session.name = doc.naam;
                req.session.score = 0;
                req.session.rondePunten = 0;

                res.send({
                    doc : doc,
                    err : err,
                    meta : {}
                });
            }
            else {
                res.send({
                    doc: doc,
                    err: 'No results',
                    meta: {}
                });
            }
        });
    })
};