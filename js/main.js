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
        
    }
}

function draw () {
    clearCanvas();

    // Draw background and grid
    gameContainer.draw(context);

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

    var houses = findElementsOfType("house");
    for(var index in houses) {
        var house = houses[index];
        if(house.containsPoint(x, y)) {
            var worker = new GameElement(house.x, house.y, CONSTANTS.WORKER_WIDTH, CONSTANTS.WORKER_HEIGHT, "worker");
            workers.push(worker);
        }
    }
}

function findElementsOfType(type) {
    return findElements(function (element) {
        return element != undefined && element.imageUrl == type;
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
                var element = new GameElement(x * tileWidth, y * tileHeight, tileWidth, tileHeight, "house");
                gameContainer.addChild(element);
                grid[x][y] = element;
            }
            else if((startX == x - 1 || startX == x || startX == x + 1) &&
                (startY == y - 1 || startY == y || startY == y + 1)) {
            } else {
                var imageName = "tree";
                var roll = Math.random();
                if(roll < 0.2) {
                    imageName = "stone";
                }
                var element = new GameElement(x * tileWidth, y * tileHeight, tileWidth, tileHeight, imageName);
                gameContainer.addChild(element);
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