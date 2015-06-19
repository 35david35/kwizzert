/* jslint node: true*/

var mongoose = require("mongoose"),
    KwizzMeestert = mongoose.model("KwizzMeestert"),
    KwizzUitvoering = mongoose.model("KwizzUitvoering");


exports.login = function (req, res) {
    authenticate(req.body.username, req.body.password, req, res, function(username) {
        newQuiz(username, req, res, function(response) {
            console.log(response);
            
            res.send(response);
        });
    });
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
    });
};

exports.getGestart = function (req, res) {
    if (!req.session || !req.session.username) return res.send({err: "ERROR: Not logged in"});
    KwizzMeestert.findOne({gebruikersnaam: req.session.username}, function (err, doc) {
        if(doc) {
            KwizzUitvoering.findOne({kwizzMeestert: doc._id}, function (err, kwizzdoc) {
                if (kwizzdoc) {
                    res.send({
                        kwizzGestart: true
                    });
                }
                else {
                    res.send({
                        kwizzGestart: false
                    });
                }
            });
        }
    });
};


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
                    });
                }
                req.session.username = req.body.username;
                res.send({
                    doc: doc,
                    err: null
                });
            });
        }
    });
};

exports.newQuiz = function(req, res) {
    newQuiz(req.session.username, req, res, function(response) {
        console.log('A new quiz has been made :D');
        
        res.send(response);
    });
};

function newQuiz(username, req, res, callback) {
    KwizzMeestert.findOne({gebruikersnaam: username}, function (err, doc) {
        if (err) {
            res.send({
                doc: null,
                err: err
            });
        }
        
        if (doc) {
            KwizzUitvoering.findOne({kwizzMeestert: doc}, function (err, kwizz) {
                if(err) {
                    res.send({
                        doc: null,
                        err: err
                    });
                }
                else {
                    console.log(kwizz);
                    
                    if(kwizz && kwizz.kwizzGesloten == 0) {
                        
                        req.session.quiz = kwizz._id;
                        
                        res = {                                
                            doc: kwizz,
                            session: req.session,
                            err: "ERROR: There is a kwizz already"
                        };
                        
                        console.log('There was a active quiz found, therefore I assigned you to that one :D');
                        
                        callback(res);
                    }
                    else {          
                        var nieuweKwizz = new KwizzUitvoering({
                            kwizzMeestert: doc._id,
                            teams: [],
                            wachtwoord: req.body.wachtwoord,
                            kwizzGesloten: 0,
                            ronde: 0,
                            kwizzGestart: 0,
                            gekozenVragen: []
                        });
                        
                        nieuweKwizz.save(function (err, kwizz) {
                            if (err) {
                                return res.send({
                                    doc: null,
                                    err: err
                                });
                            }
                            req.session.quiz = kwizz._id;

                            res = {
                                doc: kwizz,
                                err: err,
                                meta: {}
                            };
                            
                            console.log('There was no active quiz, therefore I made you a new one :D');
                            
                            callback(res);
                        });                                    
                    }
                }
            });
        }
    });
}

function authenticate( uname, passwd, req, res, callback) {
    KwizzMeestert.findOne({gebruikersnaam: uname, wachtwoord: passwd}, function (err, doc) {
        if(err) {
            res.send({
                doc: null,
                err: err
            });
        }
        if(doc) {
            req.session.username = req.body.username;
        
            callback(doc.gebruikersnaam);
        }
    });
}