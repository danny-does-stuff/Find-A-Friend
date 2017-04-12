var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello There');
});

router.post("/message", function (request, response) {
	console.log(request.body);
	response.send("<Response><Message>Hello from Twilio!</Message></Response>")
});

module.exports = function(io) {
	io.on('connection', function(socket) {

		console.log('got a connection');

		socket.on("some event", function(dataFromEvent) {
			socket.emit("some other event");
		});
	});

	return router;
};
