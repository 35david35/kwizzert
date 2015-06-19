// Require our models
require('../models/kwizzMeestert');
require('../models/team.js');
require('../models/kwizzUitvoering');

// Initialize express and load our controllers
var express = require('express'),
    router = express.Router(),
    controller = require('../controllers/mobile');

// Our routes
router.post('/checkQuizId', controller.checkQuizId)
      .post('/registerName', noName, controller.registerName);

// Function to determine if the user has made a teamname
function noName(req, res, next) {
    if(req.session && req.session.name) {
        res.send({
            err: 'You already have a name.'
        });
    }
    else {
        next();
    }
}

module.exports = router;