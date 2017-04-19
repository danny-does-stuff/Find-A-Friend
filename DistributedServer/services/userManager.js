var users = {}

function signup(number, name) {
	if (getUser(number)) {
		return 'error: User with your number already exists';
	} else {
		addUser(number, name);
		return `'${number}'successfully signed up as '${name}'`;
	}
}

function getLong() {
	var min = -111.705551;
	var max = -111.630020;

	return Math.random() * (max - min) + min;
}

function getLat() {
	var min = 40.225972;
	var max = 40.312843;

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

function getUsers() {
	return users;
}

function setUsers(toSet) {
	users = toSet;
}

function updateUsers(toSet) {
	if (Object.keys(toSet).length > Object.keys(users).length) {
		setUsers(toSet);
	}
}

module.exports = {
	signup: signup,
	getUser: getUser,
	getUsers: getUsers,
	setUsers: setUsers,
	updateUsers: updateUsers
}