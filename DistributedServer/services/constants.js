var nodeID = parseInt(process.argv[2]);

var acceptableIDs = [1, 2, 3, 4];

var urlBase = 'http://462.danny-harding.com';
var portBase = '500';

module.exports = {
	nodeID: nodeID,
	nodeIDs: acceptableIDs,
	urlBase: urlBase,
	portBase: portBase
}