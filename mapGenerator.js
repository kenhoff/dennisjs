// want map[x][y]...which is a bit complicated
//
mapPrinter = require("./mapPrinter.js");

var ROOM_CHAR = "X";
var EMPTY_CHAR = ".";

function randomStart(xmax, ymax) {
    var x = Math.floor(xmax * Math.random());
    var y = Math.floor(ymax * Math.random());
    return {x: x, y: y};
}

function emptyMap(xmax, ymax) {
    var map = [];
    for(var i = 0; i < ymax; i++) {
        map.push([]);
        for(var j = 0; j < xmax; j++) {
            map[i].push({contents: EMPTY_CHAR});
        }
    }
    return map;
}

function neighborsWithDoors(x, y, map, mapConfig) {
    var neighbor_coords = [];

    if(x > 0 && map[x-1][y].contents != EMPTY_CHAR) {
        neighbor_coords.push({x: x-1, y: y});
    }

    if(y > 0 && map[x][y-1].contents != EMPTY_CHAR) {
        neighbor_coords.push({x: x, y: y-1});
    }
    
    if(x < (mapConfig.width-1) && map[x+1][y].contents != EMPTY_CHAR) {
        neighbor_coords.push({x: x+1, y: y});
    }

    if(y < (mapConfig.height-1) && map[x][y+1].contents != EMPTY_CHAR) {
        neighbor_coords.push({x: x, y: y+1});
    }

    return neighbor_coords;
}

function neighborCandidates(x, y, map, mapConfig) {
    var neighbor_coords = [];

    if(x > 0 && map[x-1][y].contents == EMPTY_CHAR) {
        neighbor_coords.push({x: x-1, y: y});
    }

    if(y > 0 && map[x][y-1].contents == EMPTY_CHAR) {
        neighbor_coords.push({x: x, y: y-1});
    }
    
    if(x < (mapConfig.width-1) && map[x+1][y].contents == EMPTY_CHAR) {
        neighbor_coords.push({x: x+1, y: y});
    }

    if(y < (mapConfig.height-1) && map[x][y+1].contents == EMPTY_CHAR) {
        neighbor_coords.push({x: x, y: y+1});
    }

    return neighbor_coords;
}

function chooseGuaranteedOpenDoorIdx(candidates, x, y, map, mapConfig) {
    var defOpenIdx = null;

    var withNeighbors = [];
    var withoutNeighbors = []; 

    candidates.forEach(function(c) {
        var withDoors = neighborsWithDoors(c.x, c.y, map, mapConfig);
        if(withDoors.length > 1) {
            withNeighbors.push(c);
        }
        else {
            withoutNeighbors.push(c);
        }
    });

    var neighborsToChooseFrom;
    if(withNeighbors.length == 0) {
        neighborsToChooseFrom = withoutNeighbors;
    }
    else if(withoutNeighbors.length == 0) {
        neighborsToChooseFrom = withNeighbors;
        console.log("with neighbors, because without neighbors was empty");
    }
    else {
        if(Math.random() < (mapConfig.blobbiness / 2)) {
            console.log("with neighbors, random choice");
            neighborsToChooseFrom = withNeighbors;
        }
        else {
            neighborsToChooseFrom = withoutNeighbors;
        }
    }

    var defOpenIdx = Math.floor(Math.random() * neighborsToChooseFrom.length);
    var candidate = neighborsToChooseFrom[defOpenIdx];
    var cIdx = candidates.indexOf(candidate);
    return cIdx;
}

function makeDoors(x, y, map, mapConfig) {
    var doorsMade = [];

    var candidates = neighborCandidates(x, y, map, mapConfig);
    if(candidates.length == 0) {
        return doorsMade;
    }

    var defOpenIdx = chooseGuaranteedOpenDoorIdx(candidates, x, y, map, mapConfig);
    console.log(defOpenIdx, candidates);
    var defOpen = candidates[defOpenIdx];
    doorsMade.push(defOpen);
    map[defOpen.x][defOpen.y].contents = ROOM_CHAR;

    for(var i = 0; i < candidates.length; i++) {
        if(i == defOpenIdx) {
            continue;
        }
        
        var c = candidates[i];
        if(Math.random() < mapConfig.blobbiness) {
            map[c.x][c.y].contents = ROOM_CHAR;
            doorsMade.push(c);
        }
    }

    return doorsMade;
}

module.exports = function() {
    var mapConfig = {
        blobbiness: 0.01,
        width: 40,
        height: 40,
        numberOfRooms: 200,
    };

	var map = emptyMap(mapConfig.width, mapConfig.height);
    var start = randomStart(mapConfig.width, mapConfig.height);
    var nRooms = 1;

    map[start.x][start.y].contents = "S";

    var roomStack = [start];

    while(nRooms < mapConfig.numberOfRooms) {
        var cur = roomStack.pop();
        var doorsAdded = makeDoors(cur.x, cur.y, map, mapConfig);

        roomStack = roomStack.concat(doorsAdded);
        nRooms += doorsAdded.length;

        //console.log(mapPrinter(map));

        if(roomStack.length == 0) {
            console.log("Ended because stack was empty");
            break;
        }
    }

    return map;
}
