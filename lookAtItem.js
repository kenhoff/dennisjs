module.exports = function(itemString, map) {
	matchedItems = []
	playerLocation = findPlayer(map)
	thingsInRoom = map[playerLocation.x][playerLocation.y].objects.filter(function(object) {
		return (object.id != "player")
	})
	for (thing of thingsInRoom) {
		if (thing.displayName.includes(itemString)) {
			if (thing.id == "altar") {
				// build altar string
				displayNamesOfThingsInInventory = []
				for (inventoryObject of thing.inventory) {
					displayNamesOfThingsInInventory.push(inventoryObject.displayName)
				}
				switch (thing.inventory.length) {
					case 0:
						altarString = "There is nothing on the altar."
						break;
					case 1:
						altarString = "There is " + thing.inventory[0].displayName + " on the altar."
						break
					case 2:
						altarString = "There is " + thing.inventory[0].displayName + " and " + thing.inventory[1].displayName + " on the altar."
						break
					default:
						nMinusOneObjects = displayNamesOfThingsInInventory.slice(0, displayNamesOfThingsInInventory.length - 1)
						lastObject = displayNamesOfThingsInInventory[displayNamesOfThingsInInventory.length - 1]
						altarString = "There is " + nMinusOneObjects.join(", ") + ", and " + lastObject + " on the altar."
						break
				}
			} else {
				altarString = ""
			}
			matchedItems.push(thing)
		}
	}
	if (matchedItems.length != 0) {
		matchedItemStrings = []
		matchedItemAttachments = []

		for (matchedItem of matchedItems) {
			matchedItemStrings.push("There is " + matchedItem.displayName + " in the room. " + matchedItem.description);
			if ("imgURL" in matchedItem) {
				matchedItemAttachments.push({
					fallback: matchedItem.displayName,
					image_url: matchedItem.imgURL
				})
			}
		}

		// now, return string or message object with all of the things in the room.
		messageObject = {
			text: matchedItemStrings.join(" ") + " " + altarString,
			attachments: matchedItemAttachments
		}
		return messageObject
	}
	if (itemString[0].match(/[aeiou]/)) {
		return "There isn't an " + itemString + " in the room."
	} else {
		return "There isn't a " + itemString + " in the room."
	}
}
