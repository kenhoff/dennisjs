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
	bot.reply(message, "Starting a new game...")
		// if a game isn't active yet for this user, create one
		// if a game is active, then say "you already have a game going!"
	if ((message.user in games) && (games[message.user].gameActive == true)) {
		bot.reply(message, "You already have a game started!")
	} else {
		games[message.user] = {
			gameActive: true,
			map: randomMapGenerator()
		}
	}
})

controller.hears(["move"], "direct_message", function(bot, message) {
	// console.log(games[message.user]);
})

controller.hears(['map'], "direct_message", function(bot, message) {
	if (message.user in games) {
		// bot.reply(message, JSON.stringify(games[message.user].map[0][0]));
		// bot.reply(message, JSON.stringify(games[message.user].map[0][2]));
		// bot.reply(message, JSON.stringify(games[message.user].map[2][0]));
		// bot.reply(message, JSON.stringify(games[message.user].map[2][2]));
		bot.reply(message, mapPrinter(games[message.user].map))
		// bot.reply(message, "this is on one line\nthis is on another line")
		// console.log(JSON.stringify(games[message.user].map));
	} else {
		bot.reply(message, "you don't have a new game started! Start one with `new game`")
	}
})
