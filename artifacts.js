fixedArtifacts = [{
	id: "altar",
	displayChar: "a",
	displayName: "a stone altar",
	description: "It's an ominous stone altar. It looks like you can put things on it.",
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
	imgURL: "http://towerofdoom.hoff.tech/items_jacket_floor1.png",
	pickuppable: true,
	minimumLevel: 0
}, {
	id: "bunny",
	displayChar: "b",
	displayName: "a worn stuffed rabbit",
	description: "You haven't thought of it for years, but it still seems a little sad to give it up now.",
	imgURL: "http://towerofdoom.hoff.tech/items_bunny_floor2.png",
	pickuppable: true,
	minimumLevel: 1
}, {
	id: "collar",
	displayChar: "c",
	displayName: "the name of a lost dog",
	description: "You found the collar, but not the dog.",
	imgURL: "http://towerofdoom.hoff.tech/items_collar_floor2.png",
	pickuppable: true,
	minimumLevel: 1
}, {
	id: "eyes",
	displayChar: "e",
	displayName: "a pair of mom's eyes",
	description: "You look just like your father, except for--",
	imgURL: "http://towerofdoom.hoff.tech/items_momeyes_floor3.png",
	pickuppable: true,
	minimumLevel: 2
}, {
	id: "thoughts",
	displayChar: "t",
	displayName: "a memory of someone else",
	description: "You used to like them. secretly, you hope they still think of you.",
	imgURL: "http://towerofdoom.hoff.tech/items_thoughts_floor3.png",
	pickuppable: true,
	minimumLevel: 2
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
