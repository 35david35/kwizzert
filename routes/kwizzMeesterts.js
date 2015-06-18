/*jslint node: true */

var KwizzMeestert = require('../app/models/kwizzMeestert');
var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/kwizzMeestert');


router.route('/kwizzmeestertlogin')
    .post(controller.login);

router.route('/kwizzmeestert')
    .get(controller.getKwizzMeestertNaam);

router.route('/kwizzgestart')
    .get(controller.getGestart);

router.route('/kwizzmeestertregistreer')
    .post(controller.registreer);

module.exports = router;

