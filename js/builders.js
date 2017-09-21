function newWorker(x, y, jobQueue) {
    var worker = new GameElement(x, y, CONSTANTS.WORKER_WIDTH, CONSTANTS.WORKER_HEIGHT, "worker");

    worker.destination = null;
    worker.speed = 0.0001;
    worker.jobQueue = jobQueue;

    return worker;
}

function handleDestinationReached (worker) {
    var seekType;
    switch(worker.jobQueue[0]) {
        case JOB.TREE:
            seekType = ELEMENT.TREE;
            break;
        case JOB.STONE:
            seekType = ELEMENT.STONE;
            break;
        default:
            console.log("UNKNOWN JOB");
    }

    if(seekType != undefined) {
        var gridCell = grid[worker.destination.x][worker.destination.y];
        if(gridCell != undefined && gridCell.type == seekType) {
            grid[worker.destination.x][worker.destination.y] = undefined;
        } else {
            var pathToNearest = getPathToNearest(worker.destination.x, worker.destination.y, seekType);
            if(pathToNearest != null) {     
                worker.destination = pathToNearest[1];
            } else {
                //worker.destination = null;
                worker.jobQueue.shift();
            }
        }
    }
}