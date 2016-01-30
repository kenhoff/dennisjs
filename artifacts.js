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
	id: "bauble",
	displayChar: "b",
	displayName: "a bauble",
	description: "It's a shiny red bauble.",
	imgURL: "http://www.christmasshopholt.co.uk/wp-content/uploads/2013/11/krebs-red-bauble.jpg",
	pickuppable: true
}, {
	id: "emerald",
	displayChar: "e",
	displayName: "an emerald",
	description: "It's a massive green emerald, about the size of your fist.",
	imgURL: "http://inspiritcrystals.com/wp-content/uploads/2013/11/2487gemfields-emerald-in-teardrop-cut.jpg",
	pickuppable: true
}, {
	id: "skull",
	displayChar: "s",
	displayName: "a human skull",
	description: "It's a human skull. Creepy!",
	imgURL: "http://www.skullsunlimited.com/userfiles/image/category3_family_227_large.jpg",
	pickuppable: true
}, {
	id: "elvishsword",
	displayChar: "s",
	displayName: "an elvish sword",
	description: "It's a beautiful sword of elvish make.",
	pickuppable: true,
	imgURL: "http://vignette3.wikia.nocookie.net/lotr/images/b/b6/Orcrist_1.JPG/revision/latest?cb=20150509115035",
}, {
	id: "lantern",
	displayChar: "l",
	displayName: "a lantern",
	description: "It's an old brass lantern.",
	pickuppable: true,
	imgURL: "http://images.halloweencostumes.org/products/12276/1-1/ancient-light-up-lantern.jpg"
}]

module.exports = function(countOfArtifacts) {
	itemList = []
	for (var i = 0; i < countOfArtifacts; i++) {
		index = Math.floor(Math.random() * availableArtifacts.length)
		itemList.push(availableArtifacts.splice(index, 1)[0])
	}
	return itemList.concat(fixedArtifacts)
}
