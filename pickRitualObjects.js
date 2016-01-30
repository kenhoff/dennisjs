module.exports = function (availableObjects, count) {
	ritual = []
	for (var i = 0; i < count; i++) {
		ritual.push(availableObjects[i].id)
	}
	return ritual
}
