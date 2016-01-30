contentsOfRoom = require("./contentsOfRoom.js")
findPlayer = require("./findPlayer.js")

module.exports = function(controller, io) {
	controller.hears(['move (north|south|east|west)', 'go (north|south|east|west)', 'walk (north|south|east|west)'], 'direct_message', function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			// bot.reply(message, "you are going to try to move " + message.match[1])
			movePlayer(user_game.map, message.match[1], function(err) {
				if (err) {
					bot.reply(message, err)
				} else {
					io.emit("play_audio", {
						for: message.user
					})
					controller.storage.users.save({
						id: message.user,
						map: user_game.map,
						gameActive: true,
						ritual: user_game.ritual,
						ritual_progress: user_game.ritual_progress
					})
					bot.reply(message, contentsOfRoom(user_game.map))
				}
			})
		})
	})
}
