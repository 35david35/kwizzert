/* jslint node: true*/

var mongoose = require("mongoose"),
    KwizzMeestert = mongoose.model("KwizzMeestert"),
    KwizzUitvoering = mongoose.model("KwizzUitvoering");


exports.login = function (req, res) {
    authenticate(req.body.username, req.body.password, req, res)
};

exports.getKwizzMeestertNaam = function (req, res) {
    var naam;
    if (req.session && req.session.username) {
        naam = req.session.username;
    }
    else {
        naam = null;
    }
    res.send({
        username: naam
    })
}

exports.getGestart = function (req, res) {
    if (!req.session || !req.session.username) return res.send({err: "ERROR: Not logged in"});
    KwizzMeestert.findOne({gebruikersnaam: req.session.username}, function (err, doc) {
        if(doc) {
            KwizzUitvoering.findOne({kwizzMeestert: doc._id}, function (err, kwizzdoc) {
                if (kwizzdoc) {
                    res.send({
                        kwizzGestart: true
                    })
                }
                else {
                    res.send({
                        kwizzGestart: false
                    })
                }
            })
        }
    })
}


exports.registreer = function (req, res) {
    if(!req.body.username ||!req.body.password) {
        return res.send({
            doc: null,
            err: "ERROR: Invalid username or password"
        });
    }
    var doc = new KwizzMeestert({
        gebruikersnaam: req.body.username,
        wachtwoord: req.body.password
    });
    KwizzMeestert.findOne({gebruikersnaam: req.body.username}, function (err, gebruiker) {
        if (gebruiker) {
            return res.send({
                doc: null,
                err: "ERROR: User already exists"
            });
        }
        else {
            doc.save(function (err) {
                if(err) {
                    return res.send({
                        doc: null,
                        err: err
                    })
                }
                req.session.username = req.body.username;
                res.send({
                    doc: doc,
                    err: null
                })
            })
        }
    })
};

function authenticate( uname, passwd, req, res) {
    KwizzMeestert.findOne({gebruikersnaam: uname, wachtwoord: passwd}, function (err, doc) {
        if(err) {
            return res.send({
                doc: null,
                err: err
            })
        }
        if(doc) {
            req.session.username = req.body.username;
            res.send({
                doc : doc,
                session: req.session,
                err : err,
                meta : {}
            });
        }
    })
}