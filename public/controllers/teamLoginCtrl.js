angular.module("kwizzert.teamLoginCtrl", ['kwizzert.services'])

    .controller("teamLoginCtrl", function($scope, $location, apiService, kwizzMeestertService) {
        'use strict';

        // Check if he ID exists, if so direct the user to the next route
        $scope.submitId = function() {
            apiService.post('api/checkQuizId', $scope.information, function(res) {
                if (res.result != null) {
                    $location.path('/mobile/start/' + res.result.wachtwoord);
                    console.log(res);
                } else {
                    console.log({
                        body : 'This quizid is not known in our system',
                        type : 'error'
                    });
                }
            });
        };
        // Pass the chosen name to the server and direct the user to the quiz page
        $scope.submitName = function() {
            apiService.post('api/registerName', $scope.information, function(res) {
                if (res.errType) {
                    alert(res.err);
                }
                else if (res.err) {
                    alert('You already have a name.');
                    $location.path('/mobile/quiz');
                }
                else {
                    /*var team = res.doc;
                    team.socketID = socketIO.id();
                    console.log(team);
                    socketIO.emit("sign-up", team);*/
                    $location.path('/mobile/quiz');
                }
            });
        };
    });