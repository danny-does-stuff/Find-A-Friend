var users = {}

function signup(number, name) {
	if (getUser(number)) {
		return 'User with your number already exists';
	} else {
		addUser(number, name);
		return `'${number}'successfully signed up as '${name}'`;
	}
}

function addUser(number, name) {
	users[number] = {
		name: name,
		number: number
	};
}

function getUser(number) {
	return users[number];
}

module.exports = {
	signup: signup,
	getUser: getUser
}