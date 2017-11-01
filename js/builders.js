function newWorker(x, y) {
    var worker = new GameElement(x, y, CONSTANTS.WORKER_WIDTH, CONSTANTS.WORKER_HEIGHT, "worker");

    worker.currentPath = null;
    worker.speed = 0.0001;
    worker.job = undefined;
    worker.inventory = {
        type: null,
        count: 0,
        max: null     
    };

    return worker;
}

function setJob(worker, jobType) {
    worker.job = jobType;
    switch(jobType) {
        case JOB_TYPE.WOODCUTTER:
            setInventory(worker, RESOURCES.WOOD, 5);
            setDestinationOrReturn(worker, ELEMENT.TREE);
            break;
        case JOB_TYPE.STONEMINER:
            setInventory(worker, RESOURCES.STONE, 5);
            setDestinationOrReturn(worker, ELEMENT.STONE);
            break;
    }
}

function setInventory(worker, type, max) {
    worker.inventory = {
        type: type,
        count: 0,
        max: max
    };
}

function setDestinationOrReturn(worker, elementType) {
    var success = false;
    if(worker.inventory.count < worker.inventory.max) {
        success = trySetNextDestination(worker, elementType);
    }
    if(!success) {
        trySetNextDestination(worker, ELEMENT.HOUSE);
    }
}

function trySetNextDestination(worker, elementType) {
    var gridCoordinates = getGridCoordinatesFromGameCoordinates(worker.x, worker.y);

    var pathToNearest = getPathToNearest(gridCoordinates.x, gridCoordinates.y, elementType);

    if(pathToNearest != null) {     
        worker.currentPath = pathToNearest;
        return true;
    } else {
        return false;
    }
}

function gatherResources(gridCell, worker) {
    while(gridCell.health > 0 && worker.inventory.max > worker.inventory.count) {
        gridCell.health--;
        worker.inventory.count++;
    }
    if(gridCell.health == 0) {
        var gridCoordinates = getGridCoordinatesFromGameCoordinates(gridCell.x, gridCell.y);
        grid[gridCoordinates.x][gridCoordinates.y] = undefined;
    }
}

function handleDestinationReached (worker) {
    if(worker.job != undefined) {
        var destination = worker.currentPath[1];
        if(destination != undefined) {
            var gridCell = grid[destination.x][destination.y];
            var gridPos = worker.destination;
    
            switch(worker.job) {
                case JOB_TYPE.WOODCUTTER:
                    if(gridCell != undefined){
                        switch(gridCell.type) {
                            case ELEMENT.TREE:
                                gatherResources(gridCell, worker);
                                break;
                            case ELEMENT.HOUSE:
                                resources[worker.inventory.type] += worker.inventory.count;
                                worker.inventory.count = 0;
                                break;
                        }
                    }
                    setDestinationOrReturn(worker, ELEMENT.TREE);
                    break;
                case JOB_TYPE.STONEMINER:
                    break;
            }
        }
    }
}