var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')();
//var ioClient = require('socket.io-client');
//var socket1 = ioClient.connect('http://localhost:5001', {reconnect: true});
//var socket2 = ioClient.connect('http://localhost:5002', {reconnect: true});
//var socket3 = ioClient.connect('http://localhost:5003', {reconnect: true});
//var socket4 = ioClient.connect('http://localhost:5004', {reconnect: true});
var constants = require('./services/constants');
require('./services/twilio');

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


//if(port == 1){
//    //listen on ports 2, 3, 4
//    var socket1 = ioClient.connect('http://localhost:5002', {reconnect: true});
//    var socket2 = ioClient.connect('http://localhost:5003', {reconnect: true});
//    var socket3 = ioClient.connect('http://localhost:5004', {reconnect: true});
//}
//else if (port == 2){
//    //listen on ports 1, 3, 4
//    var socket1 = ioClient.connect('http://localhost:5001', {reconnect: true});
//    var socket2 = ioClient.connect('http://localhost:5003', {reconnect: true});
//    var socket3 = ioClient.connect('http://localhost:5004', {reconnect: true});
//}
//else if (port == 3){
//    //listen on ports 1, 2, 4
//    var socket1 = ioClient.connect('http://localhost:5001', {reconnect: true});
//    var socket2 = ioClient.connect('http://localhost:5002', {reconnect: true});
//    var socket3 = ioClient.connect('http://localhost:5004', {reconnect: true});
//}
//else if (port == 4){
//    //listen on ports 1, 2, 3
//    var socket1 = ioClient.connect('http://localhost:5001', {reconnect: true});
//    var socket2 = ioClient.connect('http://localhost:5002', {reconnect: true});
//    var socket3 = ioClient.connect('http://localhost:5003', {reconnect: true});
//}

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
    
    //when server receive message from client
    socket.on('estimate', function (FromNumber, TimeEstimate) {
        console.log("The time estimate we received back is: " + TimeEstimate);
        console.log("The From Number is: " + FromNumber);
    });

    // Disconnect listener
    socket.on('disconnect', function () {
        console.log('Client disconnected.');
    });
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
