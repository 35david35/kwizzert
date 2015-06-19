var KwizzUitvoering = require('../models/kwizzUitvoering');
var express = require('express');
var router = express.Router();

var controller = require('../controllers/kwizzUitvoering');

router.route('/kwizz')
    .post(controller.getQuiz)
    .get(controller.getKwizz)

module.exports = router;