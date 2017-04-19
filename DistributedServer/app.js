var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')();

var constants = require('./services/constants');
var userManager = require('./services/userManager');
var hangoutManager = require('./services/hangoutManager');
var twilio = require('./services/twilio');

// var index = require('./routes/index');
var users = require('./routes/users');
var port = constants.nodeID
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.io = io;
var routes = require('./routes/index')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next){
  res.io = io;
  next();
});


var ioClient = require('socket.io-client');

var sockets = [];

constants.nodeIDs.forEach(function(id) {
	if (id != port) {
		console.log(id);
		var socket = ioClient.connect(constants.urlBase + ':' + constants.portBase + id);

		socket.on('connect', function() {
			console.log('I\'m a client connecting to socket');
			socket.emit('update stuff', userManager.getUsers(), hangoutManager.getHangouts());
		});

		socket.on('update stuff', function(users, hangouts) {
			userManager.updateUsers(users);
			hangoutManager.updateHangouts(hangouts);
		});

		socket.on('new user', function(users) {
			userManager.setUsers(users);
		});

		socket.on('new hangout', function(hangouts) {
			hangoutManager.setHangouts(hangouts);
		});

		sockets.push(socket);
	}
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

io.on('connection', function (socket) {
    // socket variable name   ^^^^^^
    console.log('Client connected.');
    socket.emit('update stuff', userManager.getUsers(), hangoutManager.getHangouts());
    
    //when server receive message from client
    socket.on('estimate', function (fromNumber, timeEstimate) {
        console.log("The time estimate we received back is: " + timeEstimate);
        console.log("The From Number is: " + fromNumber);
        twilio.sendMessage(fromNumber, 'It will take an uber ' + timeEstimate + ' seconds to get to your location. You can figure it out.');
    });

    socket.on('update stuff', function(users, hangouts) {
		userManager.updateUsers(users);
		hangoutManager.updateHangouts(hangouts);
	});

    // Disconnect listener
    socket.on('disconnect', function () {
        console.log('Client disconnected.');
    });
});

sockets[1].on('event name', function() {
	console.log('weird')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
