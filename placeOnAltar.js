module.exports = function(controller, io) {
	controller.hears(["(place|put|drop) (.*) on altar"], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			// bot.reply(message, "you are going to try to move " + message.match[1])
			console.log(message.match[2]);
			bot.reply(message, tryToPlaceObjectOnAltar(message.match[2], user_game.map, user_game.ritual, user_game.ritual_progress))
				// check ritual progress?
			controller.storage.users.save({
				id: message.user,
				map: user_game.map,
				gameActive: true,
				ritual: user_game.ritual,
				ritual_progress: user_game.ritual_progress
			})

		})
	})
}

function tryToPlaceObjectOnAltar(objectString, map, ritual, ritual_progress) {
	// first, check to make sure that the player has the object in their inventory
	playerLocation = findPlayer(map)
	playerObject = null

	for (object of map[playerLocation.x][playerLocation.y].objects) {
		if (object.id == "player") {
			playerObject = object
		}
	}

	for (var i = 0; i < playerObject.inventory.length; i++) {
		if (playerObject.inventory[i].displayName.includes(objectString)) {
			// then, check to make sure there's an altar in the room that the player is in
			for (thingInRoom of map[playerLocation.x][playerLocation.y].objects) {
				if (thingInRoom.id == "altar") {
					// if both, then pop the player inventory, push the altar inventory
					thingInRoom.inventory.push(playerObject.inventory.splice(i, 1)[0])
					firstString = "You place the " + thingInRoom.inventory[thingInRoom.inventory.length - 1].displayName + " on the altar."
					lengthOfRitualProgress = ritual_progress.push(thingInRoom.inventory[thingInRoom.inventory.length - 1].id)
					console.log(ritual_progress);
					if (ritual[lengthOfRitualProgress - 1] != ritual_progress[lengthOfRitualProgress - 1]) {
						// fizzle
						ritual_progress.length = 0
						console.log(ritual_progress);
						return firstString += "\nYou hear a loud fizzling sound, and the items on the altar stop glowing."
					} else {
						if (ritual.length == ritual_progress.length) {
							return firstString += "\nIt glows with power.\nPtchooooo! The ritual is complete! You have been teleported to the next level."
						} else {
							return firstString += "\nIt glows with power."
						}
						// increase power of ritual
						// check if ritual is complete - if so, move to next level
					}
				}
			}
			return "There isn't an altar in the room."
		}
	}

	if (objectString[0].match(/[aeiou]/)) {
		return "There isn't an " + objectString + " in your inventory."
	} else {
		return "There isn't a " + objectString + " in your inventory."
	}
}
