var users = require('./userManager');

var hangouts = {};
var currID = 0;

function addHangout(hangout) {
	hangouts[hangout.id] = hangout;
}

function getHangout(id) {
	return hangouts[id];
}

function createHangout(phoneNumber) {
	var user = users.getUser(phoneNumber)
	if (!user) {
		return `No user with number ${phoneNumber}`;
	}

	var hangout = {
		id: getNextID(),
		creatorNumber: user.number,
		latitude: user.latitude,
		longitude: user.longitude,
		participants: {},
		closed: false
	};

	hangout.participants[user.number] = user;

	addHangout(hangout);

	return `Hangout created. Hangout ID: ${hangout.id}`;
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

	var user = users.getUser(phoneNumber);

	if (!user) {
		return `No user with number ${phoneNumber}`;
	}
	
	hangouts[id].participants[phoneNumber] = user;
	return "You joined the Hangout! Wooooo!!";
}

function getNextID() {
	return currID++;
}

module.exports = {
	createHangout: createHangout,
	addHangout: addHangout,
	endHangout: endHangout,
	joinHangout: joinHangout
}