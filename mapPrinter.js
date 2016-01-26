module.exports = function(map) {

	// a b c
	// d e f
	// g h i
	// map[0][0] == a
	// map[2][0] == c
	// map[0][2] == g
	// map[2][2] == i

	output = "```\n"

	for (var y = 0; y < map.length; y++) {
		for (var x = 0; x < map[0].length; x++) {
            if("displayChar" in map[x][y]) {
                output += map[x][y].displayChar + " "
            }
            else {
                output += "  ";
            }
		}
		output+="\n"
	}
	output+="```"
	return output
}
