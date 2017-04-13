var uuid = require('uuid/v4');

var hangouts = {};

function addHangout(zipCode) {
	var id = uuid();
	hangouts[id] = {
		id: id,
		zipCode: zipCode
	};

	return id;
}

function getHangout(id) {
	return hangouts[id];
}

module.exports = {
	addHangout: addHangout,
	getHangout: getHangout
}