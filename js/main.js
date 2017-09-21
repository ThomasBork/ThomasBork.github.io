var RESOURCE_TYPE = {
    WOOD: { 
        name: "Wood",
        description: ""
    },
    STONES: { 
        name: "Stones",
        description: ""
    },
    GOLD: {
        name: "Gold",
        description: ""
    }
};

var canvas;
var context;

var timeOfFirstFrame = Date.now();
var timeOfLastFrame = Date.now();

var gameContainer;
var grid = [];
var workers = [];

var CONSTANTS = {};
CONSTANTS.GRID_WIDTH = 12;
CONSTANTS.GRID_HEIGHT = 12;
CONSTANTS.WORKER_WIDTH = 0.6 / CONSTANTS.GRID_WIDTH;
CONSTANTS.WORKER_HEIGHT = 0.8 / CONSTANTS.GRID_HEIGHT;

var ELEMENT = {
    TREE: "tree",
    HOUSE: "house",
    STONE: "stone"
};

var JOB = {
    TREE: "tree"
};

function gameLoop () {
    requestAnimationFrame(gameLoop, canvas);

	// Calculate elapsed time
	var timeOfCurrentFrame = Date.now();
	var elapsed = timeOfCurrentFrame - timeOfLastFrame;
    timeOfLastFrame = timeOfCurrentFrame;

	// Update all game elements
	update(elapsed);
    
    // Draw all game elements
    draw();
}

function update (deltaTime) {
    for(var index in workers) {
        var worker = workers[index];

        var destinationCell = worker.destination;
        var destination = getGameCoordinatesFromGrid(destinationCell.x, destinationCell.y);

        var delta = {
            x: destination.x - worker.x,
            y: destination.y - worker.y
        };

        var deltaLength = getVectorLength(delta);

        if(deltaLength > worker.speed * deltaTime) {
            worker.x += (delta.x / deltaLength) * worker.speed * deltaTime;
            worker.y += (delta.y / deltaLength) * worker.speed * deltaTime;
        } else {
            worker.x += delta.x;
            worker.y += delta.y;

            if(worker.job == JOB.TREE) {
                var gridCell = grid[worker.destination.x][worker.destination.y];
                if(gridCell != undefined && gridCell.type == ELEMENT.TREE) {
                    grid[worker.destination.x][worker.destination.y] = undefined;
                } else {
                    var pathToNearestTree = getPathToNearest(worker.destination.x, worker.destination.y, ELEMENT.TREE);           
                    worker.destination = pathToNearestTree[1];
                }
            }
        }
    }
}

function draw () {
    clearCanvas();

    // Draw background
    gameContainer.draw(context);

    // Draw grid
    for(var x = 0; x < CONSTANTS.GRID_WIDTH; x++){
        for(var y = 0; y < CONSTANTS.GRID_WIDTH; y++){
            var element = grid[x][y];
            if(element != undefined) {
                element.draw(context);
            }
        }
    }

    // Draw workers
    for(var index in workers) {
        workers[index].draw(context);
    }
}

function clearCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle user key down
function handleKeyDown(e) {
    switch(e.keyCode) {
		case 38:
			break;
		case 40:
			break;
		case 37:
			break;
		case 39:
			break;
        default:
            // Do nothing	
	}
}

// Handle user key up
function handleKeyUp(e) {
	switch(e.keyCode) {
		case 38:
			break;
		case 40:
			break;
		case 37:
			break;
		case 39:
			break;
        default:
            // Do nothing	
	}
}

function handleClick(e) {
    var x = e.clientX;
    var y = e.clientY;

    var gridCoordinates = getGridCoordinatesFromCanvasCoordinates(x, y);

    var gridElement = grid[gridCoordinates.x][gridCoordinates.y];

    if(gridElement != undefined && gridElement.type == ELEMENT.HOUSE) {
        var worker = newWorker(gridElement.x, gridElement.y, JOB.TREE);
        workers.push(worker);

        var pathToNearestTree = getPathToNearest(gridCoordinates.x, gridCoordinates.y, ELEMENT.TREE);

        worker.destination = pathToNearestTree[0];
    }
}

function findElementsOfType(type) {
    return findElements(function (element) {
        return element != undefined && element.type == type;
    });
}

function findElements(predicate) {
    var elements = [];
    for(var x = 0; x < CONSTANTS.GRID_WIDTH; x++) {
        for(var y = 0; y < CONSTANTS.GRID_HEIGHT; y++) {
            if(predicate(grid[x][y]) == true) {
                elements.push(grid[x][y]);
            }
        }
    }
    return elements;
}

function startGame() {
    setUpUIElements();

    // Start game loop
    gameLoop();
}

// Set up ui elements
function setUpUIElements () {
    var minBrowserDim = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = minBrowserDim;
    canvas.height = minBrowserDim;

    gameContainer = new GameElement(0, 0, canvas.width, canvas.height, "grass");

    var startX = randomBetween(3, CONSTANTS.GRID_WIDTH - 3);
    var startY = randomBetween(3, CONSTANTS.GRID_HEIGHT - 3);

    var tileWidth = 1 / CONSTANTS.GRID_WIDTH;
    var tileHeight = 1 / CONSTANTS.GRID_HEIGHT;

    grid = [];
    for(var x = 0; x < CONSTANTS.GRID_WIDTH; x++) {
        grid[x] = [];
        for(var y = 0; y < CONSTANTS.GRID_HEIGHT; y++) {
            if(startX == x && startY == y) {
                var element = new GameElement(x * tileWidth, y * tileHeight, tileWidth, tileHeight, ELEMENT.HOUSE);
                grid[x][y] = element;
            }
            else if((startX == x - 1 || startX == x || startX == x + 1) &&
                (startY == y - 1 || startY == y || startY == y + 1)) {
            } else {
                var type = ELEMENT.TREE;
                var roll = Math.random();
                if(roll < 0.2) {
                    type = ELEMENT.STONE;
                }
                var element = new GameElement(x * tileWidth, y * tileHeight, tileWidth, tileHeight, type);
                grid[x][y] = element;
            }
        }
    }
}

$(document).ready(function() { 
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);

    startGame();
});