levelParams = [{
	roomCount: 3,
	ritualItemCount: 1,
	totalItemCount: 1,
	entranceText: "This tower is the prison of Ur-Grue, the legendary dream eater and memory wraith."
}, {
	roomCount: 4,
	ritualItemCount: 2,
	totalItemCount: 3,
	entranceText: "The second floor of Ur-Grue's tower materializes before your eyes. You can feel its presence slowly growing stronger..."
}, {
	roomCount: 5,
	ritualItemCount: 3,
	totalItemCount: 6,
	entranceText: "This is the third floor of Ur-Grue's tower. Your memories are starting to feel a little hazy at this point."
}, {
	roomCount: 6,
	ritualItemCount: 4,
	totalItemCount: 8,
	entranceText: "This is the fourth and penultimate floor of Ur-Grue's tower. You're not really sure what's real anymore."
}, {
	roomCount: 7,
	ritualItemCount: 5,
	totalItemCount: 10,
	entranceText: "You've reached the final floor of Ur-Grue's tower. Vanquish him before it's too late!"
}]

module.exports = {
	listenForNewGame: function(controller, bot, message) {
		newGameString = "_type `help` to learn about commands._"
			// convo.say("Go to http://dennis.hoff.tech/game/" + message.user + " for audio.")
		controller.storage.users.get(message.user, function(err, user_game) {
			if (user_game.gameActive == true) {
				bot.startPrivateConversation(message, function(err, convo) {
					convo.say("You already have a game started!")
					convo.ask("Would you like to start a new one?", [{
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
										convo.say("_For audio, open " + process.env.URL + "audio/" + message.user + " in a new tab._")
										convo.say(levelParams[0].entranceText)
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
				bot.startPrivateConversation(message, function(err, convo) {
					convo.say("Starting new game...")
					this.createLevel(0, function(game_data) {
						game_data.id = message.user
						game_data.gameActive = true
						controller.storage.users.save(game_data, function(err) {
							if (err) {
								convo.say("error starting game!")
							} else {
								convo.say(newGameString)
								convo.say("_For audio, open " + process.env.URL + "audio/" + message.user + " in a new tab._")
								convo.say(levelParams[0].entranceText)
								convo.say(contentsOfRoom(game_data.map))
							}
						})
					}.bind(this))
				}.bind(this))
			}
		}.bind(this))
	},
	createLevel: function(levelNumber, cb) {
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
