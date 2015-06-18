var KwizzUitvoering = require('../app/models/kwizzUitvoering');
var express = require('express');
var router = express.Router();

var controller = require('../app/controllers/kwizzUitvoering');

router.route('/kwizz')
    .post(controller.nieuweKwizz)
    .get(controller.getKwizz)


module.exports = router;