var express = require('express');
var router = express.Router();
var users = require('../services/userManager');
var hangouts = require('../services/hangoutManager');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello There');
});

router.post("/message", function (request, response) {
	var fromNumber = request.body.From;
	var toNumber = request.body.To;
	var message = request.body.Body.split(' ');

	if (message.length != 2) {
		response.send(`<Response><Message>Invalid message. Try 'signup <name>', 'accept <hangout ID>', or 'hangout <zip code>'</Message></Response>`);
	}

	// console.log(request.body);

	var returnMessage = 'not set';
	var action = message[0].toLowerCase();

	if (action == 'signup') {
		if (users.getUser(fromNumber)) {
			returnMessage = 'User with your number already exists';
		} else {
			users.addUser(message[1], fromNumber);
			returnMessage = `Successfully signed up as ${message[1]}`;
		}
	} else if (action == 'hangout') {
		if (message[1].length == 5 && /^\d+$/.test(message[1])) {
			var hangoutID = hangouts.addHangout(message[1]);
			returnMessage = `Hangout created. Hangout ID: ${hangoutID}`;
		} else {
			returnMessage = 'Please provide a valid zip code';
		}
	} else if (action == 'accept') {
		var hangoutID = message[1];
		var hangout = hangouts.getHangout(hangoutID);
		if (!hangout) {
			returnMessage = 'There is no hangout with this id';
		} else {
			returnMessage = 'You joined the hangout whoooo';
		}
	} else {
		returnMessage = "Invalid message. Try 'signup <name>', 'accept <hangout ID>', or 'hangout <zip code>'";
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
