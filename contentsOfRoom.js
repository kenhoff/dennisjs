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
	console.log(urls[0]);

	attachments = []

	if (urls.length >= 1) {
		attachments.push({
			"fallback": "an image",
			"image_url": urls[0]
		})
	}
	return {
		text: string,
		attachments: attachments
	}
}
