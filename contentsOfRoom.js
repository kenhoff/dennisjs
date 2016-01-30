module.exports = function(map) {
	startString = "You are in a room. There is "
	endString = " in the room."
	urls = []
	playerLocation = findPlayer(map)
	thingsInRoom = map[playerLocation.x][playerLocation.y].objects.filter(function(object) {
		return (object.id != "player")
	})

	switch (thingsInRoom.length) {
		case 0:
			string = startString + "nothing" + endString
			break;
		case 1:
			string = startString + thingsInRoom[0].displayName + endString
			if ("imgURL" in thingsInRoom[0]) {
				urls.push(thingsInRoom[0].imgURL)
			}
			break
		default:
			displayNamesOfThingsInRoom = []
			for (thing of thingsInRoom) {
				displayNamesOfThingsInRoom.push(thing.displayName)
				if ("imgURL" in thing) {
					urls.push(thing.imgURL)
				}
			}
			displayNamesOfThingsInRoom.slice()
			nMinusOneObjects = displayNamesOfThingsInRoom.slice(0, displayNamesOfThingsInRoom.length - 1)
			lastObject = displayNamesOfThingsInRoom[displayNamesOfThingsInRoom.length - 1]
			string = startString + nMinusOneObjects.join(", ") + ",  and " + lastObject + endString
			break
	}

	// if ((x < 0) || (x > map.length) || (y < 0) || (y > map[0].length)) {


	exits = []
	if (playerLocation.y != 0 && ("isRoom" in map[playerLocation.x][playerLocation.y - 1])) {
		exits.push("north")
	}
	if (playerLocation.y != map[0].length - 1 && ("isRoom" in map[playerLocation.x][playerLocation.y + 1])) {
		exits.push("south")
	}
	if (playerLocation.x != 0 && ("isRoom" in map[playerLocation.x - 1][playerLocation.y])) {
		exits.push("west")
	}
	if (playerLocation.x != map.length - 1 && ("isRoom" in map[playerLocation.x + 1][playerLocation.y])) {
		exits.push("east")
	}

	if (exits.length == 0) {
		exitString = "There are no exits."
	} else if (exits.length == 1) {
		exitString = "There is an exit to the " + exits[0] + "."
	} else if (exits.length == 2) {
		exitString = "There are exits to the " + exits[0] + " and " + exits[1] + "."
	} else {
		exitString = "There are exits to the " + exits.slice(0, exits.length - 1).join(", ") + " and " + exits[exits.length - 1] + "."
	}

	attachments = []

	if (urls.length >= 1) {
		attachments.push({
			"fallback": "an image",
			"image_url": urls[0]
		})
	}
	return {
		text: string + " " + exitString,
		attachments: attachments
	}
}
