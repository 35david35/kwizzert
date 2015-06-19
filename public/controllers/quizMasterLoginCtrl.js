/*jslint devel: true */

angular.module("kwizzert.quizMasterLoginCtrl", ['kwizzert.services'])

.controller("kwizzMeestertLoginCtrl", function($scope, $routeParams, $http, $location, apiService) {
    'use strict';

    // Initialize variables
    $scope.kwizzMeestert = {};
    $scope.kwizzMeestertNieuw = {};

    // Controller functions
    $scope.kwizzMeestertLogin = function() {
        $scope.kwizzMeestert.wachtwoord = Math.random().toString(36).substring(7);
        apiService.post('api/kwizzmeestertlogin', $scope.kwizzMeestert, function(res) {
            console.log(res);
            $location.path('/quizmaster/controlpanel');
        });
    };
    $scope.kwizzMeestertRegistreer = function() {
        apiService.post('api/kwizzmeestertregistreer', $scope.kwizzMeestertNieuw, function(res) {
            if (!res.err) {
                $location.path('/quizmaster/controlpanel');
            }
        });
    };
});