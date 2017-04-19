var express = require('express');
var router = express.Router();
var users = require('../services/userManager');
var hangouts = require('../services/hangoutManager');
var twilio = require('../services/twilio');

var invalidMessageMessage = "Invalid message. Try 'signup <name>', 'create hangout', 'accept <hangout ID>', or 'end <hangout ID>'"


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello There');
});

router.post("/message", function (request, response) {
    console.log("FROM: " + request.body.From)
    console.log("TO: " + request.body.To)
    console.log("message: " + request.body.Body)
	var fromNumber = request.body.From;
	var toNumber = request.body.To;
	var message = request.body.Body.split(' ');
    
	if (message.length != 2) {
		request.pause();
		response.status = 400;
		return response.end(`<Response><Message>${invalidMessageMessage}</Message></Response>`);
	}

	var returnMessage = 'no message';
	var action = message[0].toLowerCase();

	if (action == 'signup') {
		returnMessage = users.signup(fromNumber, message[1]);
		if (!returnMessage.startsWith('error')) {
			console.log('updated users:', users.getUsers());
			response.io.emit('new user', users.getUsers());
		}
	} else if (action == 'create' && message[1].toLowerCase() == 'hangout') {
		returnMessage = hangouts.createHangout(fromNumber);
		if (!returnMessage.startsWith('error')) {
			console.log('updated hangouts:', hangouts.getHangouts());
			response.io.emit('new hangout', hangouts.getHangouts());
			console.log('bout to notify');
			twilio.notifyUsers(returnMessage, [fromNumber]);
		}
	} else if (action == 'accept') {
		returnMessage = hangouts.joinHangout(fromNumber, message[1]);
		if (!returnMessage.startsWith('error')) {
			var fromUser = users.getUser(fromNumber);
        	response.io.emit('hangout', fromNumber, fromUser.longitude, fromUser.latitude);
        	twilio.sendMessage(hangouts.getHangout(message[1]).creatorNumber, `${fromUser.name} accepted your Hangout invitation`);
		}
	} else if (action == 'end') {
		returnMessage = hangouts.endHangout(fromNumber, message[1]);
	} else {
		returnMessage = invalidMessageMessage;
	}

	response.send(`<Response><Message>${returnMessage}</Message></Response>`);
});

module.exports = function(io) {
	io.on('estimate', function(socket) {

		console.log('got an estimate');

		socket.on("some event", function(dataFromEvent) {
			socket.emit("some other event");
		});
	});

	return router;
};
