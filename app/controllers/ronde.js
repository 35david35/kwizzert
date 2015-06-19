/* jslint node: true*/

var mongoose = require("mongoose"),
    Ronde = mongoose.model("Ronde"),
    KwizzUitvoering = mongoose.model("KwizzUitvoering");

exports.nieuweRonde = function (req, res) {
    var ronde = new Ronde({
        kwizzUitvoering: req.session.quiz,
        nummer: req.body.nummer,
        categorie: [],
        vraagtekst: [],
        status: true,
        ingezonden: []
    });
    ronde.save(function (err, doc) {
        if (err) {
            res.send({
                err: err,
                doc: doc
            });
        }
        
        KwizzUitvoering.update({ _id: req.session.quiz }, { ronde: req.body.nummer }, function(err, doc) {
            if (err) {
                res.send({
                    err: err,
                    doc: doc
                });
            }
            
            res.send({
                err: null,
                doc: ronde
            });
        });
    });
};

exports.updateRonde = function (req, res) {
    Ronde.update({kwizzUitvoering: req.session.quiz, nummer: req.body.nummer}, {categorie: req.body.categories}, function(err, doc) {
            if(err) {
                return res.send({
                    err: err
                });
            }
            res.send({
                err: null
            });
        }
    );
};

exports.postAntwoord = function (req, res) {
    Ronde.findOne({kwizzUitvoering: req.session.quiz, nummer: req.body.nummer}, function (err, doc) {
        if (doc) {
            var i, found = 0;
            for (i = 0; i < doc.ingezonden.length; i++) {
                if(doc.ingezonden[i].team == req.session.team._id) {
                    doc.ingezonden[i].tekst = req.body.tekst;
                    found = 1;
                    break;
                }
            }
            if (!found) doc.ingezonden.push({team: req.session.team._id, tekst: req.body.tekst});
            Ronde.remove({kwizzUitvoering: req.session.quiz, nummer: req.body.nummer}, function (err) {
                var ronde = new Ronde(doc);
                ronde.save(function (err) {
                    console.log("ERROR: ", err);
                    if(err) {
                        return res.send({
                            err: err
                        })
                    }
                    res.send({
                        err: null
                    })
                })
            })
        }
    })
};

exports.getRonde = function (req, res) {

};