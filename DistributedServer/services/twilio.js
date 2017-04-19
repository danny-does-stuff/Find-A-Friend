var constants = require('./constants');
var nodes = require('./nodeManager').nodes;
var userManager = require('./userManager');

var accountSid = 'ACbe01baa5621b425a569b2d404bf44ccb';
var authToken = '43f688f1eda50f2782d77e2ced026b94';
var twilioNumber = nodes[constants.nodeID].number;

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);


function sendMessage(number, body) {
	client.messages.create({
		body: body,
		to: number,
		from: twilioNumber
	}, function(err, message) {
		if (err) {
			console.log('broken twilio', err);
		}

		if (message) {
			console.log(message.sid);
		}
	});
}

function notifyUsers(message, notNumbers) {
	var users = userManager.getUsers();
	for (var userNumber in users) {
		if (!notNumbers.includes(userNumber)) {
			sendMessage(userNumber, message);
		}
	}
}

module.exports = {
	sendMessage: sendMessage
}