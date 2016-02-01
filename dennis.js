if (process.env.NODE_ENV != "production") {
	require('dotenv').config();
}

if (!process.env.SLACK_BOT_API_TOKEN) {
	console.log("*******************************************************************");
	console.log("process.env.SLACK_BOT_API_TOKEN not found!");
	console.log("run this script with a token like this:");
	console.log("SLACK_BOT_API_TOKEN=your-slack-bot-api-token-here nodemon dennis.js");
	console.log("or place SLACK_BOT_API_TOKEN=your-slack-bot-api-token-here in .env");
	console.log("*******************************************************************");
	throw "process.env.SLACK_BOT_API_TOKEN not found"
}

var express = require('express');
app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redisStorage = require('botkit-storage-redis')({
	url: process.env.REDIS_URL
})
var botkit = require('botkit');
var controller = botkit.slackbot({
	storage: redisStorage
});
var bot = controller.spawn({
	token: process.env.SLACK_BOT_API_TOKEN
})

var seedrandom = require('seedrandom');
var seed = "dennis" + String(Math.floor(Math.random() * 1e20))
	// var seed = "dennis50854962482117120000"

seedrandom(seed, {
	global: true
});
console.log("Random seed is:", seed);

randomMapGenerator = require("./mapGenerator.js")
mapPrinter = require("./mapPrinter.js")
findPlayer = require("./findPlayer.js")
movePlayer = require("./movePlayer.js")
lookAtItem = require('./lookAtItem.js');
pickRitualObjects = require("./pickRitualObjects.js")

bot.startRTM(function(err, bot, payload) {
	if (err) {
		console.log(err);
		throw new Error('Could not connect to Slack');
	} else {
		console.log("connected to slack");
	}
});

controller.on('user_channel_join', function(bot, message) {
	bot.startPrivateConversation(message, function(err, convo) {
		convo.say("Welcome to *Small Sacrifices*.")
		convo.say("*Small Sacrifices* is a text-based adventure game.")
		convo.say("type `help` to get started.")
	})
})

controller.hears(["new game", "new"], "direct_message", function(bot, message) {
	makeNewGame.listenForNewGame(controller, bot, message)
})

if (process.env.NODE_ENV != "production") {
	controller.hears(['map'], "direct_message", function(bot, message) {
		controller.storage.users.get(message.user, function(err, user_game) {
			if (user_game.gameActive == true) {
				bot.reply(message, mapPrinter(user_game.map))
			} else {
				bot.reply(message, "you don't have a new game started! Start one with `new game`")
			}
		})
	})
}

controller.hears(["look around", "look at (.*)", "look (.*)", "look", "examine", "examine (.*)", "inspect", "inspect (.*)", "read", "read (.*)"], "direct_message", function(bot, message) {
	controller.storage.users.get(message.user, function(err, user_game) {
		if (user_game.gameActive == true) {
			if (message.match[1]) {
				bot.reply(message, lookAtItem(message.match[1], user_game.map))
			} else {
				bot.reply(message, contentsOfRoom(user_game.map))
			}
		} else {
			bot.reply(message, "you don't have a new game started! Start one with `new game`")
		}
	})
})

controller.hears(["quit"], "direct_message", function(bot, message) {
	bot.startPrivateConversation(message, function(err, convo) {
		convo.ask("Are you sure you want to quit?", [{
			pattern: bot.utterances.yes,
			callback: function(response, convo) {
				controller.storage.users.save({
					id: message.user,
					gameActive: false
				}, function(err) {
					convo.say("Game ended.")
					convo.next()
				})
			}
		}])
	})
})

lookUpObjectDisplayName = function(objectID) {
	for (object of require("./artifacts.js").artifactReference()) {
		if (object.id == objectID) {
			return object.displayName
		}
	}
}

makeNewGame = require("./makeNewGame.js")

require("./movement.js")(controller, io)
require("./placeOnAltar.js")(controller, io)
require("./inventory.js")(controller, io)


commands = ["new game", "look", "move <direction>", "look <item>", "inventory", "pick up <item", "drop <item>", "place <item> on altar", "credits", "quit"]
for (var i = 0; i < commands.length; i++) {
	commands[i] = "`" + commands[i] + "`"
}
controller.hears(["help", "halp"], "direct_message", function(bot, message) {
	bot.reply(message, "Try some of these commands:\n" + commands.join("\n"))
})

controller.hears(["credits", "about"], "direct_message", function(bot, message) {
	bot.startPrivateConversation(message, function(err, convo) {
		convo.say("*Small Sacrifices* is an experimental game created by *Bananacat Studios* for *Global Game Jam 2016*.")
		convo.say({
			text: "",
			attachments: [{
				fallback: "a bananacat",
				image_url: "http://smallsacrifices.hoff.tech/bananacat_512.png"
			}]
		})
		convo.say("*Bananacat Studios* is composed of *Kacy Corlett*, *Joshua Du Chene*, and *Ken Hoff*.")
		convo.say("Thanks for playing! Excelsior!")
	})
})

controller.hears(['.*'], "direct_message", function(bot, message) {
	bot.startPrivateConversation(message, function(err, convo) {
		convo.say("I didn't quite understand that. Type `help` to get some commands that you can use.")
	})
})

app.use(express.static("img"))
app.use(express.static("audio"))

app.get("/audio/:userID", function(req, res) {
	res.sendFile(__dirname + "/audio.html")
})

io.on('connection', function(socket) {
	console.log('a user connected');
});

app.get("*", function(req, res) {
	res.redirect("https://playsmallsacrifices.hoff.tech")
})

http.listen(process.env.PORT || 3000)
