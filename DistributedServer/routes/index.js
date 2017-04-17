var express = require('express');
var router = express.Router();
var users = require('../services/userManager');
var hangouts = require('../services/hangoutManager');

var invalidMessageMessage = "Invalid message. Try 'signup <name>', 'hangout <zip code>', 'accept <hangout ID>', or 'end <hangout ID>'"


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello There');
});

router.post("/message", function (request, response) {
	var fromNumber = request.body.From;
	var toNumber = request.body.To;
	var message = request.body.Body.split(' ');

	if (message.length != 2) {
		request.pause();
		response.status = 400;
		return response.end(`<Response><Message>${invalidMessageMessage}</Message></Response>`);
	}

	// console.log(request.body);

	var returnMessage = 'no message';
	var action = message[0].toLowerCase();

	if (action == 'signup') {
		returnMessage = users.signup(fromNumber, message[1]);
	} else if (action == 'hangout') {
		returnMessage = hangouts.createHangout(fromNumber, message[1]);
	} else if (action == 'accept') {
		returnMessage = hangouts.joinHangout(fromNumber, message[1]);
	} else if (action == 'end') {
		returnMessage = hangouts.endHangout(fromNumber, message[1]);
	} else {
		returnMessage = invalidMessageMessage;
	}

	response.send(`<Response><Message>${returnMessage}</Message></Response>`);
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
