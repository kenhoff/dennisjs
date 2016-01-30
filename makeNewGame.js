
module.exports = function(controller, bot, message) {

	objectsForNewGame = require("./artifacts.js").getArtifactListForLevel(5)

	ritual = pickRitualObjects(objectsForNewGame, 3)

	inscriptions = []
	for (var i = 0; i < ritual.length; i++) {
		// ritual[i]
		inscriptions.push({
			id: "inscription" + i,
			displayChar: "i",
			displayName: "an inscription",
			description: "It's a very old inscription with a picture of " + (i + 1) + " " + ((i == 0) ? "dot" : "dots") + " beneath " + lookUpObjectDisplayName(ritual[i]) + ".",
			pickuppable: false,
		})
	}

	var mapConfig = {
		blobbiness: 0.5,
		width: 10,
		height: 10,
		numberOfRooms: 11, // minus one
		objects: objectsForNewGame.concat(inscriptions),
	};

	console.log(mapConfig.objects);

	console.log(ritual);

	newGameString = "This is the part where we explain about the plot of the game! The Ur-grue imprisoned at the top of the tower is dangerously close to breaking free, and you, the brave adventurer, must perform the ritual of vanquishing to defeat the monster, once and for all!\nEach level, you must perform a ritual to open the passage to the next level.\nThis is the line where we tell you what page to open to get some audio.\n_type `help` to learn about commands._\n_type `look` to get started._"

	// convo.say("Go to http://dennis.hoff.tech/game/" + message.user + " for audio.")

	controller.storage.users.get(message.user, function(err, user_game) {
		if (user_game.gameActive == true) {
			bot.startPrivateConversation(message, function(err, convo) {
				convo.say("you already have a game started!")
				convo.ask("would you like to start a new one?", [{
					pattern: bot.utterances.yes,
					callback: function(response, convo) {
						convo.say("Starting new game...")
						map = tryToMakeMap(mapConfig)
						controller.storage.users.save({
							id: message.user,
							gameActive: true,
							map: map,
							ritual: ritual,
							ritual_progress: []
						}, function(err) {
							if (err) {
								convo.say("error starting game!")
							} else {
								convo.say(newGameString)
								convo.next()
							}
						})
					}
				}, {
					default: true,
					callback: function(response, convo) {
						convo.next()
					}
				}])
			})
		} else {
			bot.reply(message, "Starting new game...")
			map = tryToMakeMap(mapConfig)
			controller.storage.users.save({
				id: message.user,
				gameActive: true,
				map: map,
				ritual: ritual,
				ritual_progress: []
			}, function(err) {
				if (err) {
					bot.reply(message, "error starting game!")
				} else {
					bot.reply(message, newGameString)
				}
			})
		}
	})
}

tryToMakeMap = function(mapConfig) {
	map = null
	while (!map) {
		try {
			console.log("Generating map...");
			map = randomMapGenerator(mapConfig)
		} catch (e) {
			console.log(e);
			console.log("Error with map generation.");
		}
	}
	return map
}
