"use strict";

var app = require('../app');

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});


