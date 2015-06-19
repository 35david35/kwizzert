/*jslint node: true nomen:true*/

require('./app/models/kwizzMeestert');
require('./app/models/kwizzUitvoering');
require('./app/models/team');
require('./app/models/question');
require('./app/models/ronde');

var express          = require('express'),
    app              = express(),
    fs               = require('fs'),

// Middleware
    bodyParser       = require('body-parser'),
    session          = require('express-session'),
    path             = require('path'),

// Mongoose
    mongoose         = require('mongoose'),
    dbName           = 'Kwizzert',
    connectionString = 'mongodb://localhost:27017/' + dbName,

    Quiz             = mongoose.model('KwizzUitvoering'),
    KwizzMeestert    = mongoose.model('KwizzMeestert'),
    Team             = mongoose.model('Team'),
    Question         = mongoose.model('Question'),
    Ronde            = mongoose.model('Ronde'),

    http            = require('http'),
    socketio        = require('socket.io'),
    httpServer      = http.Server(app),
    io              = socketio(httpServer);


// Initialize database connection
mongoose.connect(connectionString);

var sessionMiddleware = session({
    secret:            "keyboard cat",
    resave:            true,
    saveUninitialized: true
});

app.use(sessionMiddleware);

// Session middleware for sockets (although it does not even work properly)
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Static path to the template files
app.use(express.static(path.join(__dirname, 'public')));

// Configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

// Bootstrap routes
var routes_path = __dirname + '/app/routes',
    route_files = fs.readdirSync(routes_path);

route_files.forEach(function (file) {
    var route;
    route = require(routes_path + '/' + file);
    app.use('/api', route);
});

/* #### SocketIO #### */
io.on("connection", function(socket) {
    'use strict';

    socket.on("sign-up", function(team) {
        if (socket.request.session && socket.request.session.team) {
            socket.request.session.team.socketID = socket.id;
            io.sockets.in(socket.request.session.quiz).emit('new player', socket.request.session.team);
            console.log('team signed up');
        }
    });

    socket.on("quizmaster login", function() {
        socket.join(socket.request.session.quiz);
        console.log('Quizmaster joined quiz room: ', socket.request.session.quiz);
    });

    socket.on("join quiz", function(quizid) {
        socket.join(quizid);
    });

    socket.on('approveClient', function(info) {
        socket.broadcast.to(info.socketID).emit('approved', socket.request.session.quiz);

        Quiz.update({_id: socket.request.session.quiz},
            {$push: { teams: info.id}}, function(err, doc) {
                if(err) {
                    return err;
                }
            }
        );
        Team.findOne({_id: info.id}, function (err, doc) {
            if (doc) {
                io.sockets.in(socket.request.session.quiz).emit('team approved', doc);
            }
        });

        console.log('Team added to the kwizz');
    });

    socket.on('declineClient', function(info){
        socket.broadcast.to(info.socketID).emit('declined');
        Team.remove({_id: info.id}, function(err, doc) {
            if(err) {
                console.log(err);
            }
        });
    });

    socket.on('startQuiz', function() {
        var namespace = '/';
        var roomName = socket.request.session.quiz;
        for (var socketId in io.nsps[namespace].adapter.rooms[roomName]) {
            console.log(socketId);
        }

        io.sockets.in(socket.request.session.quiz).emit('start quiz');

        KwizzMeestert.findOne({gebruikersnaam: socket.request.session.username}, function (err, doc) {
            if(doc) {
                Quiz.update({kwizzMeestert: doc._id}, {kwizzGestart: 1}, function () {} );
            }
        });

        Question.find({})
            .distinct('categorie')
            .exec(function(err, docs) {

                socket.emit('startQuiz', docs);
            });
    });

    socket.on('getQuestion', function(categories) {
        socket.request.session.categories = categories;
        var questions = [];

        getQuestions(categories, socket, function(questions) {
            socket.emit('getQuestions', questions);
        });
    });

    socket.on('startQuestion', function(info) {
        console.log(info);

        Question.findOne({_id: info._id}, function(err, question) {

            socket.request.session.question = question;

            Quiz.update({_id: socket.request.session.quiz}, {$push: {gekozenVragen: question._id}}, function (err) {
                if (err) {
                    console.log("Kwizz update error: ", err);
                };
            });

            Ronde.update({kwizzUitvoering: socket.request.session.quiz, nummer: info.nummer}, {$push: { vraagtekst: question.tekst}}, function (err) {
                if (err) {
                    console.log("Ronde update error: ", err);
                };

                Ronde.findOne({kwizzUitvoering: socket.request.session.quiz, nummer: info.nummer}, function (err, doc) {
                    console.log("Doc: ", doc);
                    if (doc) {
                        io.sockets.in(socket.request.session.quiz).emit('send question', {ronde: info.nummer, vraagTekst: question.tekst, vraagNummer: doc.vraagtekst.length, categorie: question.categorie});
                        socket.emit('send question', question);
                    }
                });
            });
        });
    });

    socket.on('stopQuestion', function() {
        console.log('Quiz ID: ', socket.request.session.quiz);

        Quiz.findOne({ _id: socket.request.session.quiz }, function(err, quiz) {
            if (err) {
                return res.send({
                    doc : null,
                    err : err
                });
            }

            console.log('Ronde: ', quiz.ronde);

            Ronde.findOne({ kwizzUitvoering: socket.request.session.quiz, nummer: quiz.ronde }).populate('ingezonden.team').exec(function (err, doc) {
                if (err) {
                    return console.log(err);
                }
                io.sockets.in(socket.request.session.quiz).emit('stopQuestion', { question: socket.request.session.question, answers: doc.ingezonden });
            });
        });
    });

    socket.on('incrementScore', function(teamid) {
        Team.findByIdAndUpdate(teamid, { $inc: { rondePunten: 1 }}, function (err, team) {
            io.sockets.in(socket.request.session.quiz).emit('vraagGoed', teamid);
        });
    });

    socket.on('wrongAnswer', function(teamid) {
        io.sockets.in(socket.request.session.quiz).emit('vraagFout', teamid);
    });

    socket.on('nextQuestion', function(data) {
        if(data.vraagNummer < 4) {
            
            var questions = [];

            getQuestions(data.categories, socket, function(questions) {
                console.log(questions);
                
                Ronde.update({ kwizzUitvoering: socket.request.session.quiz }, {ingezonden: []}, function(err) {
                    io.sockets.in(socket.request.session.quiz).emit('nextQuestion', questions);
                });
            });

        }
        else {
            Quiz.findOne({ _id: socket.request.session.quiz }).populate('teams').exec(function(err, doc) {
                var teams = doc.teams;

                assignPoints(teams, 4, function() {
                    Question.find({})
                        .distinct('categorie')
                        .exec(function(err, categories) {

                            socket.emit(socket.request.session.quiz).emit('nextRound', categories);
                            socket.broadcast.to(socket.request.session.quiz).emit('nextRound');
                        });
                });
            });
        }
    });

    socket.on('scorebord join', function() {
        socket.join(socket.request.session.quiz);
        console.log("Scorebord joined room: ", socket.request.session.quiz);

        socket.emit('stuur wachtwoord', socket.request.session.wachtwoord);
    });

    socket.on('updateTeams', function() {
        Quiz
            .findById(socket.request.session.quiz)
            .populate('teams')
            .exec(function (err, doc) {
                if(doc) {
                    socket.emit('send teams', doc.teams);
                }
            });
    });

    socket.on('startRound', function(ronde) {
        io.sockets.in(socket.request.session.quiz).emit('roundStarted', ronde);
    });

    //Werkt nog niet
    socket.on('stuurAntwoord', function() {
        console.log("SESSION: ", socket.request.session.team._id);
        io.sockets.in(socket.request.session.quiz).emit('antwoordIngestuurd', socket.request.session.team._id);
    });
    
    socket.on('stopQuiz', function() {
       Quiz.findByIdAndUpdate({ _id: socket.request.session.quiz }, { kwizzGesloten: 1 }).populate('teams').exec(function(err, doc) {
           if(err) {
               console.log(err);
           }
           
           // Assign points before we leave
           assignPoints(doc.teams, 4, function() {
               // Stop the quiz
               io.sockets.in(socket.request.session.quiz).emit('stopQuiz');
           });
       });
    });
});

// Helper functions
function assignPoints(teams, points, callback) {
    if(teams.length > 0) {

        console.log("Voor processing: ", teams);

        var max = [];

        for(var key in teams) {
            if(!max[0] || teams[key].rondePunten > max[0].rondePunten) {
                max = [teams[key]];
            }
            else if(!max[0] || teams[key].rondePunten === max[0].rondePunten) {
                max.push(teams[key]);
            }
        }

        var arrayLength = max.length,
            count = 0;

        for(var key in max) {
            Team.findByIdAndUpdate(max[key]._id, { $inc: { score: points }, rondePunten: 0}, function (err, team) {

                for (var i=0; i < teams.length; i++) {
                    if (teams[i]._id.equals(team._id)) {

                        teams.splice(i, 1);
                        break;
                    }
                }

                switch(points) {
                    case 4:
                        points = 2;
                        break;
                    case 2:
                        points = 1;
                        break;
                    case 1:
                        points = 0.1;
                        break;
                    default:
                        points = 0.1;
                        break;
                }

                count++;

                if(count == arrayLength) {
                    assignPoints(teams, points, function() {
                        callback();
                    });
                }
            });
        }
    }
    else {
        callback();
    }
}

function getQuestions(categories, socket, callback) {
    var questions = [],
        count = 0,
        arrayLength = categories.length,
        key,
        arr = [];

    Quiz.findOne({ _id: socket.request.session.quiz }, function(err, arr) {
        // for(var i = 0; i < doc.gekozenVragen.length; i++) {
            // arr.push(doc.gekozenVragen[i]);
        // }
        
        for(key in categories) {
            Question.find( { categorie: categories[key] }, function(err, doc) {            
                for(var question in doc) {
                    if(!inArray(doc[question], arr.gekozenVragen)) {
                        questions.push(doc[question]);
                    }                    
                }
                
                if(count == arrayLength -1) {
                    //console.log(questions);
                                       
                    callback(questions);
                }
                
                count++;
            });
        }
    });
}

function inArray(needle, haystack) {
    for(var i = 0; i < haystack.length; i++) {
        console.log(haystack[i]);
        console.log(needle._id);
        console.log('================================');
        if(haystack[i].equals(needle._id)) {
            console.log('match');
            return true;
        }
            
    }
    return false;
}

// Export the module so it can be used in ./bin/www.js
module.exports = httpServer;