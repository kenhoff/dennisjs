levelParams = [{
	roomCount: 3,
	ritualItemCount: 1,
	totalItemCount: 2,
	entranceText: "You've entered the first floor of Ur-Grue's tower."
}, {
	roomCount: 4,
	ritualItemCount: 2,
	totalItemCount: 3,
	entranceText: "The second floor of Ur-Grue's tower materializes before your eyes. You can feel its presence slowly growing stronger..."
}, {
	roomCount: 5,
	ritualItemCount: 3,
	totalItemCount: 5,
	entranceText: "There are like, some serious Ur-Grue vibes going on in the third floor of the tower."
}]

module.exports = {
	listenForNewGame: function(controller, bot, message) {
		newGameString = "This is the part where we explain about the plot of the game! The Ur-Grue imprisoned at the top of the tower is dangerously close to breaking free, and you, the brave adventurer, must perform the ritual of vanquishing to defeat the monster, once and for all!\nEach level, you must perform a ritual to open the passage to the next level.\nThis is the line where we tell you what page to open to get some audio.\n_type `help` to learn about commands._\n_type `look` to get started._"
			// convo.say("Go to http://dennis.hoff.tech/game/" + message.user + " for audio.")
		controller.storage.users.get(message.user, function(err, user_game) {
			if (user_game.gameActive == true) {
				bot.startPrivateConversation(message, function(err, convo) {
					convo.say("you already have a game started!")
					convo.ask("would you like to start a new one?", [{
						pattern: bot.utterances.yes,
						callback: function(response, convo) {
							this.createLevel(0, function(game_data) {
								game_data.id = message.user
								game_data.gameActive = true
								controller.storage.users.save(game_data, function(err) {
									if (err) {
										convo.say("error starting game!")
									} else {
										convo.say(newGameString)
										convo.say(contentsOfRoom(game_data.map))

										convo.next()
									}
								})
							})
						}.bind(this)
					}, {
						default: true,
						callback: function(response, convo) {
							convo.next()
						}
					}])
				}.bind(this))
			} else {
				bot.reply(message, "Starting new game...")
				this.createLevel(0, function(game_data) {
					game_data.id = message.user
					game_data.gameActive = true
					controller.storage.users.save(game_data, function(err) {
						if (err) {
							bot.reply(message, "error starting game!")
						} else {
							bot.reply(message, newGameString)
							bot.reply(message, contentsOfRoom(game_data.map))

						}
					})
				})
			}
		}.bind(this))
	},
	createLevel: function(levelNumber, cb) {
		console.log("level", levelNumber);
		if (!levelNumber) {
			levelNumber = 0
		}
		objectsForNewGame = require("./artifacts.js").getArtifactListForLevel(levelParams[levelNumber].totalItemCount, levelNumber)

		ritual = pickRitualObjects(objectsForNewGame, levelParams[levelNumber].ritualItemCount)

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
			numberOfRooms: levelParams[levelNumber].roomCount, // minus one
			objects: objectsForNewGame.concat(inscriptions),
		};
		cb({
			map: tryToMakeMap(mapConfig),
			ritual: ritual,
			ritual_progress: [],
			level: levelNumber,
			entranceText: levelParams[levelNumber].entranceText
		})
	}
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
