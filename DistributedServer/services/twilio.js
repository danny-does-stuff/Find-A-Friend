var accountSid = 'ACbe01baa5621b425a569b2d404bf44ccb';
var authToken = '43f688f1eda50f2782d77e2ced026b94';
var twilioNumber = '+13852194899';

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

		console.log(message.sid);
	});
}

module.exports = {
	sendMessage: sendMessage
}