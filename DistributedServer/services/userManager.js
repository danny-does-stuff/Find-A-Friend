var users = {}

function signup(number, name) {
	if (getUser(number)) {
		return 'User with your number already exists';
	} else {
		addUser(number, name);
		return `'${number}'successfully signed up as '${name}'`;
	}
}

function getLong() {
	var min = -113.060059;
	var max = -109.044800;

	return Math.random() * (max - min) + min;
}

function getLat() {
	var min = 37;
	var max = 42.053117;

	return Math.random() * (max - min) + min;
}

function addUser(number, name) {
	users[number] = {
		name: name,
		number: number,
		longitude: getLong(),
		latitude: getLat()
	};

	console.log('adding user:', users[number]);
}

function getUser(number) {
	return users[number];
}

module.exports = {
	signup: signup,
	getUser: getUser
}