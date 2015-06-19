/*jslint devel: true */

angular.module("kwizzert.ScoreBoardCtrl", ['kwizzert.services'])

    .controller('scoreBordLoginCtrl', function($scope, $location, apiService) {
        // Controller functions
        $scope.submitId = function() {
            apiService.post('api/checkQuizId', $scope.information, function(res) {
                if (res.result != null) {
                    $location.path('/scorebord/' + res.result.wachtwoord);
                    console.log(res);
                } else {
                    console.log({
                        body : 'This quizid is not known in our system',
                        type : 'error'
                    });
                }
            });
        };
    })

    .controller('scoreBordCtrl', function($scope, $location, apiService, socketIO) {
        'use strict';

        // Initialize variables
        $scope.phase = 0;
        $scope.vraagTekst = "";
        $scope.vraagNummer = 0;
        $scope.ronde = 0;
        $scope.categorie = "";
        $scope.teams = [];
        $scope.wachtwoord = "";
        $scope.winnaars = [];

        socketIO.emit("scorebord join"); // ??


        // Socket IO event listeners
        socketIO.on('start quiz', function(data) {
            $scope.phase = 1;
        });

        socketIO.on('stuur wachtwoord', function(wachtwoord) {
            $scope.wachtwoord = wachtwoord;
        });

        socketIO.on('send question', function(info) {
            $scope.ronde = info.ronde;
            $scope.vraagTekst = info.vraagTekst;
            $scope.vraagNummer = info.vraagNummer;
            $scope.categorie = info.categorie;
            $scope.phase = 2;
        });

        socketIO.on('stopQuestion', function(data) {
            var i;
            for (i = 0; i < data.answers.length; i++) {
                var index = checkTeamId(data.answers[i].team._id);
                if(index != -1) {
                    $scope.teams[index].antwoord = data.answers[i].tekst;
                }
            }
            $scope.phase = 3;
        });

        socketIO.on('team approved', function(data) {
            $scope.teams.push(data);
        });

        socketIO.on('nextQuestion', function (data) {
            $scope.phase = 1;
            socketIO.emit('updateTeams');
        });

        socketIO.on('nextRound', function (data) {
            $scope.phase = 4;
            socketIO.emit('updateTeams');
        });

        socketIO.on('roundStarted', function (ronde) {
            $scope.ronde = ronde;
            $scope.phase = 5;
        });

        socketIO.on('send teams', function (teams) {
            $scope.teams = teams;
            if($scope.kwizzGesloten) {
                $scope.winnaars = getWinners(teams);
            }
        });

        socketIO.on('antwoordIngestuurd', function (teamid) {
            var index = checkTeamId(teamid);
            if(index != -1) {
                $scope.teams[index].antwoordIngestuurd = true;
            }
        });

        socketIO.on('vraagGoed', function (teamid) {
            var index = checkTeamId(teamid);
            if(index != -1) {
                $scope.teams[index].beoordeling = 1;
                $scope.teams[index].rondePunten++;
            }
        });

        socketIO.on('vraagFout', function (teamid) {
            var index = checkTeamId(teamid);
            if(index != -1) {
                $scope.teams[index].beoordeling = 2;
            }
        });

        socketIO.on('stopQuiz', function() {
            socketIO.emit('updateTeams');
            $scope.phase = 6;
            $scope.kwizzGesloten = 1;
        });

        function checkTeamId(teamid) {
            var i;
            for (i = 0; i < $scope.teams.length; i++) {
                if ($scope.teams[i]._id == teamid) {
                    return i;
                }
            }
            return -1;
        }

        function getWinners (teams) {
            console.log("TEAMS: ", teams);
            var winners = [];
            for(var i = 0; i < 3; i++) {
                var removeIndex, max = 0;
                for (var n = 0; n < teams.length; n++) {
                    if (teams[n].score > max) {
                        max = teams[n].score;
                        removeIndex = n;
                    }
                }
                if(removeIndex) {
                    teams[removeIndex].plaats = i + 1;
                    winners.push(teams[removeIndex]);
                    teams.splice(removeIndex, 1);
                }
            }
            return winners;
        }
    });