function randomBetween (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function cloneArray(arr) {
    var newArr = [];
    for(var i = 0; i<arr.length; i++) {
        newArr[i] = arr[i];
    }
    return newArr;
}

function getShortestPaths (startX, startY) {
    var pathGrid = [];
    for(var x = 0; x < CONSTANTS.GRID_WIDTH; x++) {
        pathGrid[x] = [];
        for(var y = 0; y < CONSTANTS.GRID_HEIGHT; y++) {
            pathGrid[x][y] = null;
        }
    }

    var path = [{x: startX, y: startY}];

    var moves = [{x: -1, y: 0},
        {x: 1, y: 0}, 
        {x: 0, y: -1}, 
        {x: 0, y: 1}];

    getShortestPathsInner(pathGrid, path, moves);

    return pathGrid;
}

function getShortestPathsInner (pathGrid, currentPath, moves) {
    var lastTile = currentPath[currentPath.length - 1];

    // If no known path exists or if the known path is longer than the current
    if(pathGrid[lastTile.x][lastTile.y] == null || pathGrid[lastTile.x][lastTile.y].length > currentPath.length) {
        // Update new shortest path
        pathGrid[lastTile.x][lastTile.y] = currentPath;

        if(grid[lastTile.x][lastTile.y] == undefined || grid[lastTile.x][lastTile.y].type == ELEMENT.HOUSE) {
            for(var moveIndex in moves) {
                var newX = lastTile.x + moves[moveIndex].x;
                var newY = lastTile.y + moves[moveIndex].y;
                if(newX >= 0 && newX < CONSTANTS.GRID_WIDTH && 
                    newY >= 0 && newY < CONSTANTS.GRID_HEIGHT) {
        
                    var newPath = cloneArray(currentPath);
                    newPath.push({x: newX, y: newY});
        
                    // Empty space, can pass
                    getShortestPathsInner(pathGrid, newPath, moves);
                }
            }
        }
    }
}

function getPathToNearest(gridX, gridY, type, shortestPaths) {
    if(shortestPaths == undefined) {
        shortestPaths = getShortestPaths(gridX, gridY);
    }

    var coordinates = findCoordinatesInGrid(function (x, y) {
        return shortestPaths[x][y] != null && grid[x][y] != null && grid[x][y].type == type;
    });

    var bestPath = null;
    for(var index in coordinates) {
        var co = coordinates[index];
        var path = shortestPaths[co.x][co.y];
        if(bestPath === null || path.length < bestPath.length) {
            bestPath = path;
        }
    }

    return bestPath;
}

function findCoordinatesInGrid(predicate) {
    var coordinates = [];
    for(var x = 0; x < CONSTANTS.GRID_WIDTH; x++) {
        for(var y = 0; y < CONSTANTS.GRID_HEIGHT; y++) {
            if(predicate(x, y) === true) {
                coordinates.push({x: x, y: y});
            }
        }
    }
    return coordinates;
}

function getGridCoordinatesFromCanvasCoordinates(x, y) {
    return {
        x: Math.floor(x / canvas.width * CONSTANTS.GRID_WIDTH),
        y: Math.floor(y / canvas.width * CONSTANTS.GRID_WIDTH)
    }
}

function getGridCoordinatesFromGameCoordinates(x, y) {
    return {
        x: Math.floor(x * CONSTANTS.GRID_WIDTH),
        y: Math.floor(y * CONSTANTS.GRID_WIDTH)
    }
}

function getGameCoordinatesFromGrid (x, y) {
    return {
        x: x / CONSTANTS.GRID_WIDTH, 
        y: y / CONSTANTS.GRID_HEIGHT 
    }
}