var users = {}

function addUser(name, number) {
	users[number] = {
		name: name,
		number: number
	};
}

function getUser(number) {
	return users[number];
}

module.exports = {
	addUser: addUser,
	getUser: getUser
}