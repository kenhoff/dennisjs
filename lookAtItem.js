module.exports = function(itemString, map) {
	playerLocation = findPlayer(map)
	thingsInRoom = map[playerLocation.x][playerLocation.y].objects.filter(function(object) {
		return (object.id != "player")
	})
	for (thing of thingsInRoom) {
		if (thing.displayName.includes(itemString)) {
			if ("imgURL" in thing) {
				return {
					text: thing.description,
					attachments: [{
						"fallback": thing.displayName,
						"image_url": thing.imgURL
					}]
				}
			} else {
				return thing.description
			}
		}
	}
	if (itemString[0].match(/[aeiou]/) ) {
		return "There isn't an " + itemString + " in the room."
	} else {
		return "There isn't a " + itemString + " in the room."
	}
}
