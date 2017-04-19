var nodes = {
	1: {
		port: 5001,
		number: '+13852194899'
	},
	2: {
		port: 5002,
		number: '+13852194899'
	},
	3: {
		port: 5003,
		number: '+13852194899'
	},
	4: {
		port: 5004,
		number: '+13852194899'
	}
}

function getNode(nodeID) {
	return nodes[nodeID];
}

module.exports = {
	getNode: getNode,
	nodes: nodes
}

