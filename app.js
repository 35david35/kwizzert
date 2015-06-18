var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var session = require('express-session');

var app = require('express')();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);

// Load configuration
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config.js')[env];

// Bootstrap db connection
mongoose.connect(config.db);

mongoose.connection.on('error', function (err) {
    "use strict";
    console.error('MongoDB error: %s', err);
});

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

// Configure session
var sessionMiddleware = session({
    secret: '9agL_9#A&fxq@Mj'
})
app.use(sessionMiddleware);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Bootstrap models. Read all models from the model directory
var models_path = __dirname + '/app/models',
    model_files = fs.readdirSync(models_path);
model_files.forEach(function (file) {
    require(models_path + '/' + file);
});

// Bootstrap routes
var routes_path = __dirname + '/routes',
    route_files = fs.readdirSync(routes_path);
route_files.forEach(function (file) {
    var route;
    route = require(routes_path + '/' + file);
    app.use('/api', route);
});

// Load client files
app.use(express.static(path.join(__dirname, 'client')));

// App settings
app.set('port', process.env.PORT || config.port);

io.on("connection",function(socket) {
    console.log("CONNECT:", socket.id);
});

module.exports = app;