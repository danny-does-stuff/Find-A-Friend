var users = require('./userManager');

var hangouts = {};
var currID = 0;

function addHangout(phoneNumber, zipCode) {

	var hangout = {
		id: getNextID(),
		creatorNumber: phoneNumber,
		zipCode: zipCode,
		participants: {},
		closed: false
	};

	hangout.participants[phoneNumber] = users.getUser(phoneNumber);

	hangouts[id] = hangout;

	return id;
}

function getHangout(id) {
	return hangouts[id];
}

function createHangout(phoneNumber, zipCode) {
	if (zipCode.length == 5 && /^\d+$/.test(zipCode)) {
		var hangoutID = hangouts.addHangout(phoneNumber, zipCode);
		return `Hangout created. Hangout ID: ${hangoutID}`;
	} else {
		return 'Please provide a valid zip code';
	}
}

function endHangout(phoneNumber, id) {
	if (hangouts[id].closed) {
		return `Hangout ${id} is already closed.`;
	} else if (hangouts[id].creatorNumber != phoneNumber) {
		return 'Must be Hangout creator in order to end a Hangout';
	}

	hangouts[id].closed = true;
	return `Closed hangout ${id}`;
}

function joinHangout(phoneNumber, id) {
	if (!getHangout(id)) {
		return "Invalid Hangout ID";
	}
	
	hangouts[id].participants[phoneNumber] = users.getUser(phoneNumber);
	return "You joined the Hangout! Wooooo!!";
}

function getNextID() {
	return currID++;
}

module.exports = {
	createHangout: createHangout,
	addHangout: addHangout,
	endHangout: endHangout
}