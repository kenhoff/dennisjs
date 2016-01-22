var botkit = require('botkit');
var controller = botkit.slackbot();
var bot = controller.spawn({
	token: "xoxb-18258668000-CZNGUkvapgTBTgfnRDyCbq9D"
})

randomMapGenerator = require("./mapGenerator.js")
mapPrinter = require("./mapPrinter.js")

games = {}

bot.startRTM(function(err, bot, payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	} else {
		console.log("connected to slack");
	}
});

controller.hears(["new game"], "direct_message", function(bot, message) {
	if ((message.user in games) && (games[message.user].gameActive == true)) {
		bot.startPrivateConversation(message, function(err, convo) {
			convo.say("you already have a game started!")
			convo.ask("would you like to start a new one?", [{
				pattern: bot.utterances.yes,
				callback: function(response, convo) {
					convo.say("Starting new game...")
					games[message.user] = {
						gameActive: true,
						map: randomMapGenerator()
					}
					convo.say("Welcome to the great and terrible dungeon of Yendor! The dungeon keeper, Rodney, has imprisoned your best friend, Dennis, in the depths below.")
					convo.say("Good luck!")
					convo.say("_type `help` to learn about commands._")
					convo.next()
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
		games[message.user] = {
			gameActive: true,
			map: randomMapGenerator()
		}
		bot.reply(message, "Welcome to the great and terrible dungeon of Yendor! The dungeon keeper, Rodney, has imprisoned your best friend, Dennis, in the depths below.")
		bot.reply(message, "Good luck!")
		bot.reply(message, "_type `help` to learn about commands._")
	}
})

controller.hears(['map'], "direct_message", function(bot, message) {
	if (message.user in games) {
		bot.reply(message, mapPrinter(games[message.user].map))
	} else {
		bot.reply(message, "you don't have a new game started! Start one with `new game`")
	}
})

controller.hears(['.*'], "direct_message", function(bot, message) {
	bot.reply(message, "I didn't quite understand that. Type `help` to get some commands that you can use.")
})
