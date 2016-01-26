module.exports = function(map) {
	for (var y = 0; y < map.length; y++) {
		for (var x = 0; x < map[0].length; x++) {
			if ("objects" in map[x][y]) {
				for (object of map[x][y].objects) {
					if (object.id == "player") {
						return {
							x: x,
							y: y
						}
					}
				}
			}
		}
	}
}
