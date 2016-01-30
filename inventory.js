findPlayer = require("./findPlayer.js")

module.exports = function(controller) {
	controller.hears(['inventory'], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			if (user_game.gameActive == true) {
				bot.reply(message, printPlayerInventory(user_game.map))
				controller.storage.users.save({
					id: message.user,
					map: user_game.map,
					gameActive: true
				})
			} else {
				bot.reply(message, "you don't have a new game started! Start one with `new game`")
			}
		})
	})
	controller.hears(["pick up (.*)", "pick up"], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			if (user_game.gameActive == true) {
				bot.reply(message, attemptToGet(message.match[1], user_game.map))
				controller.storage.users.save({
					id: message.user,
					map: user_game.map,
					gameActive: true
				})
			} else {
				bot.reply(message, "you don't have a new game started! Start one with `new game`")
			}
		})
	})
	controller.hears(["drop (.*)", "drop"], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			if (user_game.gameActive == true) {
				bot.reply(message, attemptToDrop(message.match[1], user_game.map))
				controller.storage.users.save({
					id: message.user,
					map: user_game.map,
					gameActive: true
				})
			} else {
				bot.reply(message, "you don't have a new game started! Start one with `new game`")
			}
		})

	})
}

function attemptToGet(itemString, map) {
	playerLocation = findPlayer(map)
	playerObject = null
	for (object of map[playerLocation.x][playerLocation.y].objects) {
		if (object.id == "player") {
			playerObject = object
		}
	}
	thingsInRoom = map[playerLocation.x][playerLocation.y].objects.filter(function(object) {
		return (object.id != "player")
	})
	for (var i = 0; i < thingsInRoom.length; i++) {
		if (thingsInRoom[i].displayName.includes(itemString)) {
			// pop off room objects list, push onto player inventory list
			item = map[playerLocation.x][playerLocation.y].objects.splice(i, 1)[0]
			// map[playerLocation.x][playerLocation.y].objects.splice(i, 1)
			putInInventory(item, map)
			return {
				text: "You pick up " + thingsInRoom[i].displayName + " and put it in your pack."
			}
		}
	}
	return "That item isn't in the room!"
}

function putInInventory(object, map) {
	playerLocation = findPlayer(map)
	for (var i = 0; i < map[playerLocation.x][playerLocation.y].objects.length; i++) {
		if (map[playerLocation.x][playerLocation.y].objects[i].id == "player") {
			map[playerLocation.x][playerLocation.y].objects[i].inventory.push(object)
		}
	}
}

function attemptToDrop(itemString, map) {
	playerLocation = findPlayer(map)
	playerObject = null
	for (object of map[playerLocation.x][playerLocation.y].objects) {
		if (object.id == "player") {
			playerObject = object
		}
	}
	thingsInRoom = map[playerLocation.x][playerLocation.y].objects.filter(function(object) {
		return (object.id != "player")
	})
	for (var i = 0; i < playerObject.inventory.length; i++) {
		if (playerObject.inventory[i].displayName.includes(itemString)) {
			// pop off room objects list, push onto player inventory list
			map[playerLocation.x][playerLocation.y].objects.push(playerObject.inventory.splice(i, 1)[0])
			return {
				text: "You take " + map[playerLocation.x][playerLocation.y].objects[map[playerLocation.x][playerLocation.y].objects.length - 1].displayName + " out of your pack and drop it on the floor."
			}
		}
	}
	return "That item isn't in your inventory!"
}

function printPlayerInventory(map) {
	playerLocation = findPlayer(map)
	playerObject = null

	for (object of map[playerLocation.x][playerLocation.y].objects) {
		if (object.id == "player") {
			playerObject = object
		}
	}
	if (playerObject.inventory.length == 0) {
		return "You don't have anything in your inventory."
	} else if (playerObject.inventory.length == 1) {
		return "You have " + playerObject.inventory[0].displayName + " in your inventory."
	} else if (playerObject.inventory.length == 2) {
		return "You have " + playerObject.inventory[0].displayName + " and " + playerObject.inventory[0].displayName + " in your inventory."
	} else {
		return "You have " + playerObject.inventory.slice(0, playerObject.inventory.length - 1).join(", ") + " and " + playerObject.inventory[playerObject.inventory.length - 1] + " in your inventory."
	}
}
