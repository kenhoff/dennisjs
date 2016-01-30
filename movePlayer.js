findPlayer = require('./findPlayer.js');

module.exports = function(map, direction, cb) {
	playerLocation = findPlayer(map)
	switch (direction) {
		case "north":
			tryToMove(map, playerLocation.x, playerLocation.y - 1, function(err) {
				cb(err)
			})
			break
		case "south":
			tryToMove(map, playerLocation.x, playerLocation.y + 1, function(err) {
				cb(err)
			})
			break
		case "east":
			tryToMove(map, playerLocation.x + 1, playerLocation.y, function(err) {
				cb(err)
			})
			break
		case "west":
			tryToMove(map, playerLocation.x - 1, playerLocation.y, function(err) {
				cb(err)
			})
			break
	}
}

tryToMove = function(map, x, y, cb) {
	if ((x < 0) || (x > map.length - 1) || (y < 0) || (y > map[0].length - 1)) {
		return cb("You bump clumsily into the wall. Not sure what you were trying to accomplish with that.")
	} else if (map[x][y].isRoom) {
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
		cb("You bump clumsily into the wall. Not sure what you were trying to accomplish with that.")
	}
}
