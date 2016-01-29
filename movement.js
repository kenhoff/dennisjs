contentsOfRoom = require("./contentsOfRoom.js")
findPlayer = require("./findPlayer.js")



module.exports = function(controller, io) {
	controller.hears(['move (north|south|east|west)'], 'direct_message', function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			// bot.reply(message, "you are going to try to move " + message.match[1])
			movePlayer(user_game.map, message.match[1], function(err) {
				if (err) {
					bot.reply(message, "You can't move there.")
					console.log(err);
				} else {
					io.emit("play_audio", {for: message.user})
					controller.storage.users.save({
						id: message.user,
						map: user_game.map,
						gameActive: true
					})
					playerLocation = findPlayer(user_game.map)
					bot.reply(message, contentsOfRoom(user_game.map))
						// display "look" text of what's in a room
				}
			})
		})
	})
}
