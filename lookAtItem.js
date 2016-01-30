module.exports = function(itemString, map) {
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
			if ("imgURL" in thing) {
				return {
					text: thing.description + " " + altarString,
					attachments: [{
						"fallback": thing.displayName,
						"image_url": thing.imgURL
					}]
				}
			} else {
				return thing.description + " " + altarString
			}
		}
	}
	if (itemString[0].match(/[aeiou]/)) {
		return "There isn't an " + itemString + " in the room."
	} else {
		return "There isn't a " + itemString + " in the room."
	}
}
