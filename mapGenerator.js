// want map[x][y]...which is a bit complicated
//
mapPrinter = require("./mapPrinter.js");

var ROOM_CHAR = ".";

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
            map[i].push({});
        }
    }
    return map;
}

function neighborsWithDoors(x, y, map, mapConfig) {
    var neighbor_coords = [];

    if(x > 0 && Object.keys(map[x-1][y]).length > 0) {
        neighbor_coords.push({x: x-1, y: y});
    }

    if(y > 0 && Object.keys(map[x][y-1]).length > 0) {
        neighbor_coords.push({x: x, y: y-1});
    }

    if(x < (mapConfig.width-1) && Object.keys(map[x+1][y]).length > 0) {
        neighbor_coords.push({x: x+1, y: y});
    }

    if(y < (mapConfig.height-1) && Object.keys(map[x][y+1]).length > 0) {
        neighbor_coords.push({x: x, y: y+1});
    }

    return neighbor_coords;
}

function neighborCandidates(x, y, map, mapConfig) {
    var neighbor_coords = [];

    if(x > 0 && Object.keys(map[x-1][y]).length == 0) {
        neighbor_coords.push({x: x-1, y: y});
    }

    if(y > 0 && Object.keys(map[x][y-1]).length == 0) {
        neighbor_coords.push({x: x, y: y-1});
    }

    if(x < (mapConfig.width-1) && Object.keys(map[x+1][y]).length == 0) {
        neighbor_coords.push({x: x+1, y: y});
    }

    if(y < (mapConfig.height-1) && Object.keys(map[x][y+1]).length == 0) {
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
    }
    else {
        if(Math.random() < (mapConfig.blobbiness / 2)) {
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

function findRestartLocation(x, y, map, mapConfig, nRooms) {
    var maxWalkback = Math.floor(Math.random() * nRooms);

    var cur_node = {x: x, y: y};
    var walkedBack = 0;
    while(walkedBack < maxWalkback) {
        var cands = neighborsWithDoors(x, y, map, mapConfig);

        if(cands.length == 0) {
            break;
        }
        else {
            walkedBack += 1;
            cur_node = cands[Math.floor(Math.random() * cands.length)];
        }
    }

    return cur_node;
}

function makeDoors(x, y, map, mapConfig) {
    var doorsMade = [];

    var candidates = neighborCandidates(x, y, map, mapConfig);
    if(candidates.length == 0) {
        return doorsMade;
    }

    var defOpenIdx = chooseGuaranteedOpenDoorIdx(candidates, x, y, map, mapConfig);
    var defOpen = candidates[defOpenIdx];
    doorsMade.push(defOpen);
    map[defOpen.x][defOpen.y].objects = [];
    map[defOpen.x][defOpen.y].x = x;
    map[defOpen.x][defOpen.y].y = y;
    map[defOpen.x][defOpen.y].doors = {};
    map[defOpen.x][defOpen.y].isRoom = true;

    for(var i = 0; i < candidates.length; i++) {
        if(i == defOpenIdx) {
            continue;
        }

        var c = candidates[i];
        if(Math.random() < mapConfig.blobbiness) {
            map[c.x][c.y].objects = [];
            map[c.x][c.y].x = x;
            map[c.x][c.y].y = y;
            map[c.x][c.y].doors = {};
            map[c.x][c.y].isRoom = true;
            doorsMade.push(c);
        }
    }

    return doorsMade;
}

function placeObjects(roomList, map, mapConfig) {
    var nPlaced = 0;
    var maxPlaced = mapConfig.objects.length;

    while(nPlaced < maxPlaced) {
        var i = Math.floor(Math.random() * roomList.length);
        var room = roomList[i];
        map[room.x][room.y].objects.push(mapConfig.objects[nPlaced]);
        nPlaced += 1;
    }
}

function markDoors(roomList, map) {
    roomList.forEach(function(roomCoords) {
        var x = roomCoords.x;
        var y = roomCoords.y;
        var room = map[x][y];
        if(x > 0) {
            room.doors.west = "isRoom" in map[x-1][y];
        }

        if(x < (map[0].length - 1)) {
            room.doors.east = "isRoom" in map[x+1][y];
        }

        if(y > 0) {
            room.doors.north = "isRoom" in map[x][y-1];
        }

        if(y < (map.length - 1)) {
            room.doors.south = "isRoom" in map[x][y+1];
        }
    });
}

module.exports = function(mapConfig) {
	var map = emptyMap(mapConfig.width, mapConfig.height);
    var start = randomStart(mapConfig.width, mapConfig.height);
    var nRooms = 1;

    map[start.x][start.y].objects = [];
    map[start.x][start.y].x = start.x;
    map[start.x][start.y].y = start.y;
    map[start.x][start.y].doors = {};
    map[start.x][start.y].isRoom = true;

    var roomStack = [start];
    var roomList = [];

    while(nRooms < mapConfig.numberOfRooms) {
        var cur = roomStack.pop();
        var doorsAdded = makeDoors(cur.x, cur.y, map, mapConfig);
        roomList.push(cur);

        roomStack = roomStack.concat(doorsAdded);
        nRooms += doorsAdded.length;

        if(roomStack.length == 0) {
            roomStack.push(findRestartLocation(cur.x, cur.y, map, mapConfig, nRooms));
        }
    }

    //markDoors(roomList, map);
    placeObjects(roomList, map, mapConfig);
    return map;
}
