
var app = angular.module("kwizzMeestertApp", ["ngRoute", "kwizzert.services"]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/kwizzmeestert/login', {
                templateUrl: '/partials/kwizzmeestertlogin.html',
                controller: 'kwizzMeestertLoginCtrl'
            }).
            when('/kwizzmeestert/controlpanel', {
                templateUrl: '/partials/kwizzmeestertpanel.html',
                controller: 'kwizzMeestertCtrl'
            }).
            otherwise({
                redirectTo: '/kwizzmeestert/login',
                controller: 'kwizzMeestertLoginCtrl'
            });
    }]);

app.controller("kwizzMeestertLoginCtrl",function ($scope, $routeParams, $http, $location, apiService) {
    'use strict';

    $scope.kwizzMeestert = {};
    $scope.kwizzMeestertNieuw = {};

    $scope.kwizzMeestertLogin = function() {
        apiService.post('api/kwizzmeestertlogin', $scope.kwizzMeestert, function () {
            $location.path('/kwizzmeestert/controlpanel');
        })
    };
    $scope.kwizzMeestertRegistreer = function() {
        apiService.post('api/kwizzmeestertregistreer', $scope.kwizzMeestertNieuw, function (res) {
            if(!res.err) $location.path('/kwizzmeestert/controlpanel');
        })
    };
});

app.controller("kwizzMeestertCtrl",function ($scope, $location, apiService, kwizzMeestertService) {
    'use strict';

    kwizzMeestertService.getKwizzMeestertNaam().then(function(d) {
        if(!d) $location.path('/kwizzmeestert/login');
    });

    kwizzMeestertService.getKwizzGestart().then(function(d) {
        $scope.kwizzGestart = d;
    });

    $scope.nieuweKwizz = function() {
        var kwizz = {wachtwoord: Math.random().toString(36).substring(7)};
        apiService.post('api/kwizz', kwizz, function () {

        })
    }
});