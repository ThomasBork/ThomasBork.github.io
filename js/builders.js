function newWorker(x, y) {
    var worker = new GameElement(x, y, CONSTANTS.WORKER_WIDTH, CONSTANTS.WORKER_HEIGHT, "worker");

    worker.destination = null;
    worker.speed = 0.0001;

    return worker;
}