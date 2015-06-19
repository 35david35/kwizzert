/*jslint devel: true */

angular.module("kwizzert.quizMasterCtrl", ['kwizzert.services'])

    .controller("QuizMasterCtrl", function ($scope, $http, $location, apiService, socketIO, kwizzMeestertService) {
        'use strict';

        /* Initialize variables */
        $scope.teams = [];
        $scope.hideButton = [];
        $scope.categories = [];
        $scope.addedCategories = [];
        $scope.phase = 0;
        $scope.ronde = 0;
        $scope.questions = [];
        $scope.vraagTekst = "";
        $scope.hideAnswerButtons = [];
        $scope.vraagNummer = 0;
        $scope.quiz = {};

        /* Check to see if the QuizMaster is logged in */
        kwizzMeestertService.getKwizzMeestertNaam().then(function (d) {
            if (!d) {
                $location.path('/quizmaster/login');
            }
        });

        /* Create a new quiz */
        socketIO.emit('quizmaster login');  // ??

        /* Get quiz information */
        getQuiz(function (quiz) {
            $scope.quiz = quiz;

            console.log($scope.quiz);
        });

        /* Controller functions */
        $scope.approveClient = function (id, socketID) {
            socketIO.emit('approveClient', {id: id, socketID: socketID});

            $scope.hideButton[id] = true;
        };

        $scope.declineClient = function (id) {
            socketIO.emit('declineClient', {id: id});

            $scope.hideButton[id] = true;
        };

        $scope.startQuiz = function () {
            socketIO.emit('startQuiz');
            $scope.ronde = 1;

            apiService.post('api/ronde', {nummer: $scope.ronde}, function (res) {
                console.log(res);
            });
        };

        $scope.addCategory = function (name) {
            if ($scope.addedCategories.length < 3) {
                $scope.addedCategories.push(name);

                $scope.categories = removeItem($scope.categories, name);
            }
        };

        $scope.deleteCategory = function (name) {
            $scope.categories.push(name);

            $scope.addedCategories = removeItem($scope.addedCategories, name);
        };

        $scope.getQuestions = function () {
            socketIO.emit('getQuestion', $scope.addedCategories);
            apiService.put('api/ronde', {nummer: $scope.ronde, categories: $scope.addedCategories}, function() {

            });
        };

        $scope.startQuestion = function (id) {
            socketIO.emit('startQuestion', {nummer: $scope.ronde, _id: id});
        };

        $scope.stopQuestion = function () {
            socketIO.emit('stopQuestion');
        };

        $scope.approveAnswer = function (teamId) {
            socketIO.emit('incrementScore', teamId);

            $scope.hideAnswerButtons[teamId] = true;
        };

        $scope.declineAnswer = function (teamId) {
            socketIO.emit('wrongAnswer', teamId);

            $scope.hideAnswerButtons[teamId] = true;
        };

        $scope.nextQuestion = function() {
            
            socketIO.emit('nextQuestion', {vraagNummer: $scope.vraagNummer, categories: $scope.addedCategories});
        };

        $scope.stopQuiz = function () {
            socketIO.emit('stopQuiz');
        };

        $scope.newQuiz = function () {
            /* Initialize variables */
            $scope.teams = [];
            $scope.hideButton = [];
            $scope.categories = [];
            $scope.addedCategories = [];
            $scope.phase = 0;
            $scope.ronde = 0;
            $scope.questions = [];
            $scope.vraagTekst = "";
            $scope.hideAnswerButtons = [];
            $scope.vraagNummer = 0;
            $scope.quiz = {};
            $scope.kwizzMeestert = {};

            console.log('I was HERE!');

            // Generate new wachtwoord
            $scope.kwizzMeestert.wachtwoord = Math.random().toString(36).substring(7);

            apiService.post('api/newQuiz', $scope.kwizzMeestert, function (quiz) {
                console.log(quiz);

                $scope.quiz = quiz.doc;
                $scope.phase = 0;

                console.log('test: ', $scope.quiz);
            });
        };

        /* Socket IO Event listeners */
        socketIO.on('startQuiz', function (data) {
            console.log(data);

            $scope.categories = data;
            $scope.phase = 1;
        });

        socketIO.on('getQuestions', function (data) {
            $scope.questions = data;
            $scope.phase = 2;
            socketIO.emit('startRound', $scope.ronde);
        });

        socketIO.on('send question', function (question) {
            console.log(question);
            $scope.question = question;
            $scope.phase = 3;
        });

        socketIO.on('sendAnswer', function (data) {
            $scope.answers[data.team] = data;
            $scope.hideAnswerButtons[data.team] = false;
        });

        socketIO.on('stopQuestion', function (data) {
            $scope.answers = data.answers;
            $scope.question = data.question;
            $scope.phase = 4;

            for (var key in data.answers) {
                $scope.hideAnswerButtons[data.answers[key].team._id] = false;
            }
        });

        socketIO.on('nextQuestion', function(questions) {
            $scope.questions = questions;
            $scope.vraagNummer++;
            $scope.phase = 2;
            $scope.hideAnswerButtons = [];
        });

        socketIO.on('nextRound', function(data) {
            $scope.ronde++;

            apiService.post('api/ronde', {nummer: $scope.ronde}, function(res) {
                console.log(res);
            });

            $scope.vraagNummer = 0;
            $scope.categories = data;
            $scope.addedCategories = [];
            $scope.phase = 1;
        });

        socketIO.on('new player', function(team) {
            $scope.teams.push(team);
            $scope.hideButton[team._id] = false;

            console.log($scope.teams);
        });

        socketIO.on('stopQuiz', function() {
            $scope.phase = 5;
        });

        // Helper Functions
        function removeItem(array, item) {
            for (var i in array) {
                if (array[i] == item) {
                    array.splice(i, 1);
                    break;
                }
            }

            return array;
        }

        function getQuiz(callback) {
            apiService.post('api/kwizz', {object: "test"}, function(res) {
                callback(res.doc);
            });
        }
    });