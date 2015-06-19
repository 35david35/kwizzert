/*jslint devel: true */

angular.module("kwizzert.services", [])

    .factory('apiService', ['$http', function($http) {
        'use strict';

        var factory = {};

        factory.post = function(resource, data, callBackFunction) {
            $http.post(resource, data).success(function(res) {
                callBackFunction(res);
            }).error(function(data, status) {
                console.log("ERROR: apiService", status, data);
            });
        };
        factory.put = function(resource, data, callBackFunction) {
            $http.put(resource, data).success(function(res) {
                callBackFunction(res);
            }).error(function(data, status) {
                console.log("ERROR: apiService", status, data);
            });
        };

        return factory;
    }])

    .factory('socketIO', function($rootScope) {
        'use strict';

        var socket = io();
        socket.on("connect", function() {
            console.log("connected", socket.io.engine.id);
        });
        return {
            on : function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit : function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },
            id : function() {
                return socket.io.engine.id;
            }
        };
    })

    .factory('kwizzMeestertService', ['$http', function($http) {
        'use strict';

        var factory = {
            getKwizzGestart: function() {
                var promise = $http.get('/api/kwizzgestart').then(function (response) {
                    return response.data.kwizzGestart;
                });
                return promise;
            },
            getTeams: function() {
                var promise = $http.get('/api/teams').then(function (response) {
                    return response.data.teams;
                });
                return promise;
            },
            getKwizzMeestertNaam: function() {
                var promise = $http.get('/api/kwizzmeestert').then(function (response) {
                    return response.data.username;
                });
                return promise;
            }
        };
        return factory;
    }]);