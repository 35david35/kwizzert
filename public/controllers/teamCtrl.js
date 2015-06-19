/*jslint devel: true */

angular.module("kwizzert.teamCtrl", ['kwizzert.services'])

    .controller("teamCtrl", function($scope, $location, apiService, socketIO, kwizzMeestertService) {
        'use strict';

        // Initialize variables
        $scope.phase = 0;
        $scope.vraagTekst = "";
        $scope.vraagNummer = 0;
        $scope.ronde = 0;
        $scope.hideAnswerButtons = [];
        $scope.answers = [];
        $scope.vraagInfo = {};
        $scope.vraagStatus = 1;

        socketIO.emit("sign-up");

        // Controller functions
        $scope.verstuurAntwoord = function () {
            if(!$scope.vraagInfo.tekst) return alert("Antwoord mag niet leeg zijn!");
            var info = {
                tekst: $scope.vraagInfo.tekst,
                nummer: $scope.ronde
            };
            apiService.post('api/antwoord', info, function() {
                $scope.vraagInfo.tekst = "";
                $scope.vraagStatus = 2;
            });
            socketIO.emit('stuurAntwoord');
        };

        // Socket IO event listeners
        socketIO.on('approved', function(quizid) {
            $scope.phase = 1;
            socketIO.emit('join quiz', quizid);
        });
        socketIO.on('declined', function(data) {
            $scope.phase = 2;
        });

        socketIO.on('start quiz', function(data) {
            $scope.phase = 3;
        });

        socketIO.on('send question', function(data) {
            console.log(data);
            $scope.phase = 4;
            $scope.vraagTekst = data.vraagTekst;
            $scope.vraagNummer = data.vraagNummer;
            $scope.ronde = data.ronde;
            $scope.vraagStatus = 1;
        });

        socketIO.on('stopQuestion', function() {
            $scope.phase = 5;
        });

        socketIO.on('nextRound', function (data) {
            $scope.phase = 6;
        });

        socketIO.on('roundStarted', function (ronde) {
            $scope.ronde = ronde;
            $scope.phase = 7;
        });
        socketIO.on('stopQuiz', function() {
            $scope.phase = 8;
        });
    });