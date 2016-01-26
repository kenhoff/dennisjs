findPlayer = require('./findPlayer.js');

module.exports = function(map, direction, cb) {
	playerLocation = findPlayer(map)
	switch (direction) {
		case "north":
			tryToMove(playerLocation.x, playerLocation.y + 1, function(err) {
				cb(err)
			})
		case "south":
			tryToMove(playerLocation.x, playerLocation.y - 1, function(err) {
				cb(err)
			})
		case "east":
			tryToMove(playerLocation.x + 1, playerLocation.y, function(err) {
				cb(err)
			})
		case "west":
			tryToMove(playerLocation.x - 1, playerLocation.y + 1, function(err) {
				cb(err)
			})
		default:
			cb("invalid direction")
	}
}

tryToMove = function(x, y, cb) {
	if (map[x][y].isRoom) {
		// remove player from the current room, add them to the new room
		map[playerLocation.x][playerLocation.y] // room that the player is in
		// find the index of the player in the objects array in the room
		for (var i = 0; i < map[playerLocation.x][playerLocation.y].objects.length; i++) {
			if (map[playerLocation.x][playerLocation.y].objects[i].id == "player") {
				// push the old player onto the new location
				map[x][y].objects.push(map[playerLocation.x][playerLocation.y].objects[i])
				// remove the player from the old location
				map[playerLocation.x][playerLocation.y].objects.splice(i, 1)
				return cb(null)
			}
		}
	} else {
		cb("not a room!")
	}
}
