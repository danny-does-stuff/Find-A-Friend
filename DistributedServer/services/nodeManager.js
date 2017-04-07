var nodes = {
	1: {
		port: 5001

	},
	2: {
		port: 5002

	},
	3: {
		port: 5003

	},
	4: {
		port: 5004

	}
}

function getNode(nodeID) {
	return nodes[nodeID];
}

module.exports = {
	getNode: getNode
}

