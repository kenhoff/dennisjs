module.exports = function(map) {

	// a b c
	// d e f
	// g h i
	// map[0][0] == a
	// map[2][0] == c
	// map[0][2] == g
	// map[2][2] == i

	output = "```"

	for (var y = 0; y < 3; y++) {
		for (var x = 0; x < 3; x++) {
			output += map[x][y].contents
		}
		output+="\n"
	}
	output+="```"
	return output
}
