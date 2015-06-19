var Ronde = require('../models/ronde');
var express = require('express');
var router = express.Router();

var controller = require('../controllers/ronde');

router.route('/ronde')
    .post(controller.nieuweRonde)
    .get(controller.getRonde)
    .put(controller.updateRonde)

router.route('/antwoord')
    .post(controller.postAntwoord)

module.exports = router;