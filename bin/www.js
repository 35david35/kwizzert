/*jslint node: true, devel:true */
"use strict";

var http = require('../app');
//Require our app

var server = http.listen(3000, function () {
    console.log('Yo Dawg I Am Listening On Port ' + 3000);
});