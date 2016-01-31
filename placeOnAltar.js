var makeNewGame = require('./makeNewGame.js');
var contentsOfRoom = require('./contentsOfRoom.js');

module.exports = function(controller, io) {
	controller.hears(["(place|put|drop) (.*) on altar"], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			tryToPlaceObjectOnAltar(message.match[2], user_game.map, user_game.ritual, user_game.ritual_progress, function(responseString, completedRitual) {
				bot.reply(message, responseString)
				if (completedRitual) {
					// do stuff
					if (user_game.level == 4) {
						bot.startPrivateConversation(message, function (err, convo) {
							controller.storage.users.save({
								id: message.user,
								map: user_game.map,
								gameActive: false,
								ritual: user_game.ritual,
								ritual_progress: user_game.ritual_progress,
								level: user_game.level
							})
							convo.say("The Ur-Grue is vanquished.")
							convo.say("You are victorious!")
							convo.say("For now.")
							convo.say("")
							convo.say("The _Tower Of Doom_ is an experimental game created by Bananacat Studios for Global Game Jam 2016.")
							convo.say("Bananacat Studios is composed of Kacy Corlett, Joshua Du Chene, and Ken Hoff.")
							convo.say("Thanks for playing! Excelsior!")
						})
					} else {
						makeNewGame.createLevel(user_game.level + 1, function(game_data) {
							game_data.id = message.user
							game_data.gameActive = true
							controller.storage.users.save(game_data)
							bot.reply(message, game_data.entranceText)
							bot.reply(message, contentsOfRoom(game_data.map))
						})
					}
				} else {
					controller.storage.users.save({
						id: message.user,
						map: user_game.map,
						gameActive: true,
						ritual: user_game.ritual,
						ritual_progress: user_game.ritual_progress,
						level: user_game.level
					})
				}
			})
		})
	})
}

function tryToPlaceObjectOnAltar(objectString, map, ritual, ritual_progress, cb) {
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
					if (ritual[lengthOfRitualProgress - 1] != ritual_progress[lengthOfRitualProgress - 1]) {
						// fizzle
						ritual_progress.length = 0
						return cb(firstString += "\nYou hear a loud fizzling sound, and the items on the altar stop glowing.", false)
					} else {
						if (ritual.length == ritual_progress.length) {
							return cb(firstString += "\nIt glows with power.\nPtchooooo! The ritual is complete! You have been teleported to the next level.", true)
						} else {
							return cb(firstString += "\nIt glows with power.", false)
						}
						// increase power of ritual
						// check if ritual is complete - if so, move to next level
					}
				}
			}
			return cb("There isn't an altar in the room.", false)
		}
	}

	if (objectString[0].match(/[aeiou]/)) {
		return cb("There isn't an " + objectString + " in your inventory.")
	} else {
		return cb("There isn't a " + objectString + " in your inventory.")
	}
}
