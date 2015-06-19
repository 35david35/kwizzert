var express = require('express');
var router = express.Router();

// Require our models
require('../models/kwizzMeestert');
require('../models/team.js');
require('../models/kwizzUitvoering');

var mongoose = require('mongoose'),
    Team = mongoose.model('Team'),
    Quiz = mongoose.model('KwizzUitvoering'),
    KwizzMeestert = mongoose.model('KwizzMeestert');

router.get('/ronde', function(req, res) {
    'use strict';
    
    var r1 = new Ronde({
        categorie : 'Talen',
        vraagtekst : 'Testvraag',
        status : true,
        ingezonden : [{
            tekst : 'Testantwoord',
            team : undefined // Object ID van team moet hier komen
        }]
    });
    
    r1.save(function(err, doc) {
        if (err) {
            return console.error(err);
        }
        res.send({
            doc : doc,
            err : err,
            meta : {}
        });
    });
});

router.get('/kwizzMeestert', function(req, res) {
    'use strict';
    
    var admin = new KwizzMeestert({
        gebruikersnaam : 'John Doe',
        wachtwoord : 'TestWachtwoord' 
    });
    
    admin.save(function(err, doc) {
        if (err) {
            return console.error(err);
        }
        res.send({
            doc : doc,
            err : err,
            meta : {}
        });
    });
});

router.get('/team', function(req, res) {
    'use strict';
    
    var t1 = new Team({
       naam : 'HeideRoosjes',
       score : 5000,
       rondPunten : 3000
    });
    
    t1.save(function(err, doc) {
        if(err) { 
            return err;
        }
        
        res.send({
            doc : doc,
            err : err,
            meta : {} 
        });
    });
});

router.get('/team-ronde', function(req, res) {
    'use strict';
    
    var t1 = new Team({
       naam : 'HeideRoosjes',
       score : 5000,
       rondPunten : 3000
    });
    
    t1.save(function(err, doc) {
        if(err) { 
            return err;
        }
        
        var r2 = new Ronde({
            categorie : 'Dieren',
            vraagtekst : 'Hoe groot is een beer',
            status : true,
            ingezonden : [{
                tekst : '2meter20',
                team : doc // Object ID van team moet hier komen
            }]
        });
        
        r2.save(function(err, doc) {
            if (err) {
                return console.error(err);
            }
        });
    });
    
    res.send('success');
});

router.get('/populate', function (req, res) {
    'use strict';

    Ronde.find().populate('ingezonden.team').exec(function (err, doc) {
        if (err) {
            return res.send({
                doc : null,
                err : err
            });
        }
        
        return res.json({
            doc : doc,
            err : err
        });
    });
});

function isLoggedIn(req, res, next) {
    if(req.session && req.session.isLoggedIn === true) {
        console.log('User is logged in and send to the appropiate page.');
        next();
    }
    else {
        console.log('User was not logged in, it was send to the authentication page.');
        res.redirect('/login');
    }
}

router.get('/newQuiz', function(req, res) {
    
    var kwizzMeestert = new KwizzMeestert({
        gebruikersnaam : 'Sander',
        wachtwoord : 'TestTest'
    });
    
    var team = new Team({
        naam : 'HeideRoosjes',
        score : 0,
        rondePunten : 0
    });
    
    var teams = [];
    teams.push(team._id);
    
    var quiz = new Quiz({
        kwizzMeestert: kwizzMeestert._id,
        teams: teams,
        wachtwoord: 'test'
    });
    
    kwizzMeestert.save(function(err, doc) {
        if (err) {
            return console.error(err);
        }
    });
    
    team.save(function(err, doc) {
        if (err) {
            return console.error(err);
        }
    });
    
    quiz.save(function(err, doc) {
        if (err) {
            return console.error(err);
        }
    });
    
    res.send('ok'); 
});

module.exports = router;