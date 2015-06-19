/*jslint node: true */

var KwizzMeestert = require('../models/kwizzMeestert');
var express = require('express');
var router = express.Router();

var controller = require('../controllers/kwizzMeestert');


router.route('/kwizzmeestertlogin')
    .post(controller.login);

router.route('/kwizzmeestert')
    .get(controller.getKwizzMeestertNaam);

router.route('/kwizzgestart')
    .get(controller.getGestart);

router.route('/kwizzmeestertregistreer')
    .post(controller.registreer);
    
router.route('/newQuiz')
    .post(controller.newQuiz);

module.exports = router;

