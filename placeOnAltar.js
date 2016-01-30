module.exports = function(controller, io) {
	controller.hears(["(place|put|drop) (.*) on altar"], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			// bot.reply(message, "you are going to try to move " + message.match[1])
			console.log(message.match[2]);
			bot.reply(message, tryToPlaceObjectOnAltar(message.match[2], user_game.map))
			controller.storage.users.save({
				id: message.user,
				map: user_game.map,
				gameActive: true
			})

		})
	})
}

function tryToPlaceObjectOnAltar(objectString, map) {
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
					return "You place the " + thingInRoom.inventory[thingInRoom.inventory.length - 1].displayName + " on the altar."
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
