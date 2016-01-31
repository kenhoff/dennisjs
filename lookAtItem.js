module.exports = function(itemString, map) {
	altarString = ""
	roomMatchedItems = []
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
			roomMatchedItems.push(thing)
		}
	}

	// now, get all inventory matched items
	inventoryMatchedItems = []
	for (object of map[playerLocation.x][playerLocation.y].objects) {
		if (object.id == "player") {
			playerObject = object
		}
	}
	for (playerInventoryObject of playerObject.inventory) {
		if (playerInventoryObject.displayName.includes(itemString)) {
			inventoryMatchedItems.push(playerInventoryObject)
		}
	}

	combinedMatchedItems = roomMatchedItems.concat(inventoryMatchedItems)

	if (combinedMatchedItems.length != 0) {
		combinedMatchedItemStrings = []
		combinedMatchedItemAttachments = []

		// loop through inventoryMatchedItems
		for (inventoryMatchedItem of inventoryMatchedItems) {
			combinedMatchedItemStrings.push("There is " + inventoryMatchedItem.displayName + " in your inventory. " + inventoryMatchedItem.description);
			if ("imgURL" in inventoryMatchedItem) {
				combinedMatchedItemAttachments.push({
					fallback: inventoryMatchedItem.displayName,
					image_url: inventoryMatchedItem.imgURL
				})
			}
		}

		// loop through roomMatchedItems
		for (roomMatchedItem of roomMatchedItems) {
			combinedMatchedItemStrings.push("There is " + roomMatchedItem.displayName + " in the room. " + roomMatchedItem.description);
			if ("imgURL" in roomMatchedItem) {
				combinedMatchedItemAttachments.push({
					fallback: roomMatchedItem.displayName,
					image_url: roomMatchedItem.imgURL
				})
			}
		}

		// now, return string or message object with all of the things in the room.
		messageObject = {
			text: combinedMatchedItemStrings.join(" ") + " " + altarString,
			attachments: combinedMatchedItemAttachments
		}
		return messageObject
	}
	if (itemString[0].match(/[aeiou]/)) {
		return "There isn't an " + itemString + " in the room or in your pack."
	} else {
		return "There isn't a " + itemString + " in the room or in your pack."
	}
}
