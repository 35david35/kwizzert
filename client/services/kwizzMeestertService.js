
services.factory('kwizzMeestertService', ['$http', function($http) {
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