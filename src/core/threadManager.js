// const {Worker} = require('worker_threads');
// const path = require("path");
//
// class ThreadManager {
//     constructor(numThreads = 4) {
//         this.workerPath = path.resolve(__dirname, 'workerTemplate.js');
//         this.numThreads = numThreads;
//         this.workers = [];
//         this.taskQueue = [];
//         this.activeTasks = 0;
//         this.shuttingDown = false;
//         console.log("why", numThreads)
//
//         for (let i = 0; i < numThreads; i++) {
//             console.log("*outercreateWorker")
//
//             this.createWorker();
//         }
//     }
//
//     createWorker() {
//         console.log("*createWorker")
//
//         const worker = new Worker(this.workerPath);
//         worker.on('message', (result) => this.handleWorkerResult(worker, result));
//         worker.on('error', (err) => this.handleWorkerError(worker, err));
//         worker.on('exit', (code) => this.handleWorkerExit(worker, code));
//         this.workers.push(worker);
//     }
//
//     handleWorkerResult(worker, result) {
//         console.log("*handleWorkerResult")
//
//         this.activeTasks--;
//         this.assignTask(worker);
//         this.checkAndShutdown();
//     }
//
//     handleWorkerError(worker, err) {
//         console.log("*handleWorkerError")
//
//         console.error(`Worker encountered an error: ${err}`);
//         this.activeTasks--;
//         this.assignTask(worker);
//         this.checkAndShutdown();
//     }
//
//     handleWorkerExit(worker, code) {
//         console.log("*handleWorkerExit")
//
//         console.log(`Worker exited with code ${code}`);
//         this.workers = this.workers.filter(w => w !== worker);
//         if (!this.shuttingDown && this.workers.length < this.numThreads) {
//             this.createWorker();
//         }
//         this.checkAndShutdown();
//     }
//
//     addTask(taskData) {
//         return new Promise((resolve, reject) => {
//             console.log("addTask inner", taskData)
//             this.taskQueue.push({taskData, resolve, reject});
//             this.assignTask();
//         });
//     }
//
//     assignTask(worker) {
//         if (this.taskQueue.length === 0 || this.activeTasks >= this.workers.length) {
//             console.log("*1")
//
//             return;
//         }
//
//         if (!worker) {
//             console.log("*2")
//
//             worker = this.workers.find(w => w.threadId !== -1);
//         }
//
//         if (worker && this.taskQueue.length > 0) {
//             console.log("*3")
//
//             const {taskData, resolve, reject} = this.taskQueue.shift();
//             this.activeTasks++;
//
//             worker.once('message', resolve);
//             worker.once('error', reject);
//             worker.postMessage(taskData);
//         }
//     }
//
//     checkAndShutdown() {
//         console.log("*checkAndShutdown")
//
//         if (this.shuttingDown && this.activeTasks === 0 && this.workers.length === 0) {
//             console.log('All tasks completed. Shutting down ThreadManager.');
//             this.shutdown();
//         }
//     }
//
//     shutdown() {
//         console.log("*shutdown")
//
//         console.log('Shutting down all workers...');
//         this.shuttingDown = true;
//         this.workers.forEach(worker => worker.terminate());
//         this.workers = [];
//         console.log('ThreadManager has been shut down.');
//     }
// }
//
// module.exports = ThreadManager;
// const {Worker} = require('worker_threads');
// const path = require('path');
//
// class ThreadManager {
//     constructor(taskQueue, numThreads = 4) {
//         this.workerPath = path.resolve(__dirname, 'workerTemplate.js');
//         this.numThreads = numThreads;
//         this.workers = [];
//         this.taskQueue = taskQueue;
//         this.activeTasks = 0;
//         this.shuttingDown = false;
//
//         for (let i = 0; i < numThreads; i++) {
//             this.createWorker();
//         }
//     }
//
//     createWorker() {
//         const worker = new Worker(this.workerPath);
//         worker.on('message', (result) => this.handleWorkerResult(worker, result));
//         worker.on('error', (err) => this.handleWorkerError(worker, err));
//         worker.on('exit', (code) => this.handleWorkerExit(worker, code));
//         worker.isAvailable = () => !worker.currentTask;
//         worker.assignTask = (task) => {
//             this.activeTasks++;
//             worker.currentTask = task;
//             worker.postMessage(task.data);
//         };
//         this.workers.push(worker);
//     }
//
//     checkAndShutdown() {
//         if (this.shuttingDown && this.activeTasks === 0 && this.workers.length === 0) {
//             console.log('All tasks completed. Shutting down ThreadManager.');
//             this.shutdown();
//         }
//     }
//
//     handleWorkerResult(worker, result) {
//         this.activeTasks--;
//         worker.currentTask = null;
//         this.taskQueue.assignTaskToWorkerOrProcess(this.workers);
//         this.checkAndShutdown();
//     }
//
//     handleWorkerError(worker, err) {
//         console.error(`Worker encountered an error: ${err}`);
//         this.activeTasks--;
//         worker.currentTask = null;
//         this.taskQueue.assignTaskToWorkerOrProcess(this.workers);
//         this.checkAndShutdown();
//     }
//
//     handleWorkerExit(worker, code) {
//         console.log(`Worker exited with code ${code}`);
//         this.workers = this.workers.filter(w => w !== worker);
//         if (!this.shuttingDown && this.workers.length < this.numThreads) {
//             this.createWorker();
//         }
//         this.checkAndShutdown();
//     }
//
//     addTask(taskData) {
//         return new Promise((resolve, reject) => {
//             console.log("addTask inner", taskData);
//             this.taskQueue.push({taskData, resolve, reject});
//             this.assignTask();
//         });
//     }
//
//     shutdown() {
//         this.shuttingDown = true;
//         this.workers.forEach(worker => worker.terminate());
//     }
// }
//
// module.exports = ThreadManager;

const {Worker} = require('worker_threads');
const path = require('path');

class ThreadManager {
    constructor(numThreads = 4) {
        this.workerPath = path.resolve(__dirname, 'workerTemplate.js');
        this.numThreads = numThreads;
        this.workers = [];
        this.taskQueue = [];
        this.activeTasks = 0;
        this.shuttingDown = false;
        console.log("numThreads", numThreads)

        for (let i = 0; i < numThreads; i++) {
            console.log("createWorker")
            this.createWorker();
        }
    }

    createWorker() {
        const worker = new Worker(this.workerPath);
        worker.on('message', (result) => this.handleWorkerResult(worker, result));
        worker.on('error', (err) => this.handleWorkerError(worker, err));
        worker.on('exit', (code) => this.handleWorkerExit(worker, code));
        this.workers.push(worker);
    }

    handleWorkerResult(worker, result) {
        this.activeTasks--;
        worker.currentTask = null;
        this.assignTask(worker);
        this.checkAndShutdown(); // Ensure this method exists and is properly defined
    }

    handleWorkerError(worker, err) {
        console.error(`Worker encountered an error: ${err}`);
        this.activeTasks--;
        worker.currentTask = null;
        this.assignTask(worker);
        this.checkAndShutdown(); // Ensure this method exists and is properly defined
    }

    handleWorkerExit(worker, code) {
        this.workers = this.workers.filter(w => w !== worker);
        if (!this.shuttingDown && this.workers.length < this.numThreads) {
            this.createWorker();
        }
        this.checkAndShutdown(); // Ensure this method exists and is properly defined
    }

    addTask(taskData) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({taskData, resolve, reject});
            this.assignTask();
        });
    }

    assignTask(worker) {
        if (this.taskQueue.length === 0 || this.activeTasks >= this.workers.length) {
            return;
        }

        if (!worker) {
            worker = this.workers.find(w => !w.currentTask);
        }

        if (worker && this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            this.activeTasks++;
            worker.currentTask = task;
            worker.once('message', task.resolve);
            worker.once('error', task.reject);
            worker.postMessage(task.taskData);
        }
    }

    checkAndShutdown() {
        if (this.shuttingDown && this.activeTasks === 0 && this.workers.length === 0) {
            console.log('All tasks completed. Shutting down ThreadManager.');
            this.shutdown();
        }
    }

    shutdown() {
        console.log('Shutting down all workers...');
        this.shuttingDown = true;
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        console.log('ThreadManager has been shut down.');
    }
}

module.exports = ThreadManager;
