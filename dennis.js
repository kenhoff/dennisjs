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

randomMapGenerator = require("./mapGenerator.js")
mapPrinter = require("./mapPrinter.js")
findPlayer = require("./findPlayer.js")
movePlayer = require("./movePlayer.js")

var mapConfig = {
	blobbiness: 0.5,
	width: 10,
	height: 10,
	numberOfRooms: 11,
	objects: [{
		id: "goblin",
		displayChar: "g",
		displayName: "a goblin",
		imgURL: "http://www.diabloii.net/wp-content/uploads/2012/12/PZO1114-GoblinTreasure.jpg"
	}, {
		id: "gold",
		displayChar: "$",
		displayName: "a pile of gold coins"
	}, {
		id: "up_staircase",
		displayChar: "<",
		displayName: "a staircase leading upwards"
	}, {
		id: "down_staircase",
		displayChar: ">",
		displayName: "a staircase leading downwards"
	}, {
		id: "player",
		displayChar: "p",
		displayName: "you, the adventurer"
	}],
};

bot.startRTM(function(err, bot, payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	} else {
		console.log("connected to slack");
	}
});

controller.hears(["new game"], "direct_message", function(bot, message) {
	controller.storage.users.get(message.user, function(err, user_game) {
		if (user_game.gameActive == true) {
			bot.startPrivateConversation(message, function(err, convo) {
				convo.say("you already have a game started!")
				convo.ask("would you like to start a new one?", [{
					pattern: bot.utterances.yes,
					callback: function(response, convo) {
						convo.say("Starting new game...")
						map = randomMapGenerator(mapConfig)
						controller.storage.users.save({
							id: message.user,
							gameActive: true,
							map: map
						}, function(err) {
							if (err) {
								convo.say("error starting game!")
							} else {
								convo.say("Welcome to the great and terrible dungeon of Yendor! The dungeon keeper, Rodney, has imprisoned your best friend, Dennis, in the depths below.")
								convo.say("Good luck!")
								convo.say("Go to http://dennis.hoff.tech/game/" + message.user + " for audio.")
								convo.say("_type `help` to learn about commands._")
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
			map = randomMapGenerator(mapConfig)
			controller.storage.users.save({
				id: message.user,
				gameActive: true,
				map: map
			}, function(err) {
				if (err) {
					bot.reply(message, "error starting game!")
				} else {
					bot.reply(message, "Welcome to the great and terrible dungeon of Yendor! The dungeon keeper, Rodney, has imprisoned your best friend, Dennis, in the depths below.")
					bot.reply(message, "Good luck!")
					bot.reply(message, "_type `help` to learn about commands._")
				}
			})
		}
	})
})

controller.hears(['map'], "direct_message", function(bot, message) {
	controller.storage.users.get(message.user, function(err, user_game) {
		if (user_game.gameActive == true) {
			bot.reply(message, mapPrinter(user_game.map))
		} else {
			bot.reply(message, "you don't have a new game started! Start one with `new game`")
		}
	})
})

controller.hears(['look'], "direct_message", function(bot, message) {
	controller.storage.users.get(message.user, function(err, user_game) {
		if (user_game.gameActive == true) {
			bot.reply(message, contentsOfRoom(user_game.map))
		} else {
			bot.reply(message, "you don't have a new game started! Start one with `new game`")
		}
	})
})

require("./movement.js")(controller, io)

controller.hears(['.*'], "direct_message", function(bot, message) {
	bot.reply(message, "I didn't quite understand that. Type `help` to get some commands that you can use.")
})

app.use(express.static("img"))
app.use(express.static("audio"))

app.get("/game/:userID", function (req, res) {
	res.sendFile(__dirname + "/audio.html")
})

io.on('connection', function(socket){
  console.log('a user connected');
});

app.get("*", function(req, res) {
	res.redirect("https://playdennis.hoff.tech")
})

http.listen(process.env.PORT || 3000)
