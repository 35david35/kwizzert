var services = angular.module("kwizzert.services", [])
    .factory('apiService', ['$http', function($http) {
        'use strict';

        var factory = {};

        factory.post = function(resource, data, callBackFunction) {
            $http.post(resource, data)
                .success(function(res) {
                    callBackFunction(res);
                }).error(function(data, status) {
                    console.log("ERROR: Kwizzert", status, data);
                });
        };

        factory.get = function(resource, callBackFunction) {
            $http.get(resource)
                .success(function(res) {
                    callBackFunction(res);
                }).error(function(data, status) {
                    console.log("ERROR: Kwizzert", status, data);
                });
        };

        return factory;
    }]);