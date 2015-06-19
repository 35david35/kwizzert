var express     = require('express'), 
    app         = express(), 
    http        = require('http'), 
    socketio    = require('socket.io'), 
    httpServer  = http.Server(app), 
    io          = socketio(httpServer);

io.on("connection", function(socket) {
    'use strict';

    socket.on("sign-up", function(team) {
        socket.broadcast.emit("new player", team);
    });
    
    socket.on('approve', function(information) {
        
    });
    
    socket.on('decline', function() {
        
    });
});