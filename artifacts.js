fixedArtifacts = [{
	id: "altar",
	displayChar: "a",
	displayName: "a stone altar",
	description: "It's an ominous stone altar. It looks like you can put things on it.",
	imgURL: "http://smallsacrifices.hoff.tech/altar2.png",
	pickuppable: false,
	inventory: []
}, {
	id: "player",
	displayChar: "p",
	displayName: "you, the adventurer",
	pickuppable: false,
	inventory: []
}]

availableArtifacts = [{
	id: "jacket",
	displayChar: "j",
	displayName: "your favorite jacket",
	description: "Worn leather. It fits you perfectly.",
	imgURL: "http://smallsacrifices.hoff.tech/items_jacket_floor1.png",
	pickuppable: true,
	minimumLevel: 0
}, {
	id: "bunny",
	displayChar: "b",
	displayName: "a worn stuffed rabbit",
	description: "You haven't thought of it for years, but it still seems a little sad to give it up now.",
	imgURL: "http://smallsacrifices.hoff.tech/items_bunny_floor2.png",
	pickuppable: true,
	minimumLevel: 1
}, {
	id: "collar",
	displayChar: "c",
	displayName: "the collar of a lost dog",
	description: "You found the collar, but not the dog.",
	imgURL: "http://smallsacrifices.hoff.tech/items_collar_floor2.png",
	pickuppable: true,
	minimumLevel: 1
}, {
	id: "eyes",
	displayChar: "e",
	displayName: "mom's eyes",
	description: "You look just like your father, except for--",
	imgURL: "http://smallsacrifices.hoff.tech/items_momeyes_floor4.png",
	pickuppable: true,
	minimumLevel: 3
}, {
	id: "thoughts",
	displayChar: "t",
	displayName: "a memory of someone else",
	description: "You used to like them. secretly, you hope they still think of you.",
	imgURL: "http://smallsacrifices.hoff.tech/items_thoughts_floor3.png",
	pickuppable: true,
	minimumLevel: 2
}, {
	id: "laugh",
	displayChar: "l",
	displayName: "dad's laughter",
	description: "Loud and welcoming.",
	imgURL: "http://smallsacrifices.hoff.tech/items_dadslaugh_floor3.png",
	pickuppable: true,
	minimumLevel: 2
}, {
	id: "song",
	displayChar: "s",
	displayName: "an old song",
	description: "It gets in your head sometimes, but you can never remember the words.",
	imgURL: "http://smallsacrifices.hoff.tech/items_song_floor4.png",
	pickuppable: true,
	minimumLevel: 3
}, {
	id: "photos",
	displayChar: "p",
	displayName: "a photo booth reel",
	description: "These were taken a long time ago.",
	imgURL: "http://smallsacrifices.hoff.tech/items_photos_floor3.png",
	pickuppable: true,
	minimumLevel: 2
}, {
	id: "hands",
	displayChar: "h",
	displayName: "your hands",
	description: "You've always had them.",
	imgURL: "http://smallsacrifices.hoff.tech/items_hands_floor5.png",
	pickuppable: true,
	minimumLevel: 4
}, {
	id: "words",
	displayChar: "w",
	displayName: "your words",
	description: "Use them while you can.",
	imgURL: "http://smallsacrifices.hoff.tech/items_words_floor5.png",
	pickuppable: true,
	minimumLevel: 4
}, {
	id: "hate",
	displayChar: "h",
	displayName: "your hate",
	description: "Bottled up for future use.",
	imgURL: "http://smallsacrifices.hoff.tech/items_hate_floor5.png",
	pickuppable: true,
	minimumLevel: 4
}, {
	id: "love",
	displayChar: "l",
	displayName: "your love",
	description: "Not quite a heart, but works just as well.",
	imgURL: "http://smallsacrifices.hoff.tech/items_heart_floor5.png",
	pickuppable: true,
	minimumLevel: 4
}, {
	id: "sleep",
	displayChar: "s",
	displayName: "another night's sleep",
	description: "What's one more, after all this?",
	imgURL: "http://smallsacrifices.hoff.tech/items_sleep_floor4.png",
	pickuppable: true,
	minimumLevel: 3
}, {
	id: "time",
	displayChar: "t",
	displayName: "all your time",
	description: "It just keeps pouring.",
	imgURL: "http://smallsacrifices.hoff.tech/items_time_floor5.png",
	pickuppable: true,
	minimumLevel: 4
}, {
	id: "summer",
	displayChar: "s",
	displayName: "one warm summer",
	description: "You got ice cream, and you got sunburnt. you wonder if that ice cream place is even still around, anymore.",
	imgURL: "http://smallsacrifices.hoff.tech/items_summer_floor4.png",
	pickuppable: true,
	minimumLevel: 3
}]

module.exports = {
	getArtifactListForLevel: function(countOfArtifacts, levelNumber) {
		newAvailableArtifacts = availableArtifacts.slice()
		itemList = []
		while (itemList.length < countOfArtifacts) {
			index = Math.floor(Math.random() * newAvailableArtifacts.length)
			if (newAvailableArtifacts[index].minimumLevel <= levelNumber) {
				itemList.push(newAvailableArtifacts.splice(index, 1)[0])
			} else {}
		}
		return itemList.concat(fixedArtifacts)
	},
	artifactReference: function() {
		return availableArtifacts
	}
}
