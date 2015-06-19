var express = require('express');
var routes = express.Router();

routes.get('/test', function(req, res){
    req.session.isLoggedIn = true;
    
    res.send('ok');
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

module.exports = routes;