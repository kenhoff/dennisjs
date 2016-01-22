mapGenerator({
	blobbiness: 0.666, // can be 0...1 inclusive
	width: 10, // int
	height: 10, // int
	numberOfRooms: 10, // int
	objects: [{
		// shit pertaining to object
		displayChar: "g",
		displayName: "goblin"
	}, {
		displayChar: "$",
		displayName: "gold"
	}, {
		// can have multiple copies of the same object
		displayChar: "$",
		displayName: "gold"
	}, {
		displayName: "entrance",
		displayChar: "<"
	}, {
		displayName: "exit",
		displayChar: ">"
	}]
})

// only place one of anything in a room
