/**
 * Description:
 * This file implements the ThreadManager, which manages tasks using worker threads in Node.js.
 * It creates multiple workers to execute tasks concurrently, manages task assignments, handles errors,
 * and monitors the state of the workers. It also includes methods to add tasks to the queue, assign tasks
 * to available workers, and shut down the manager gracefully.
 *
 * Purpose of the File:
 * - Manage task execution using worker threads.
 * - Create, manage, and monitor worker threads.
 * - Assign tasks to available workers.
 * - Handle worker errors, restarts, and shutdown processes.
 * - Gracefully shut down all workers when tasks are completed.
 */

// Import the Worker class from the worker_threads module and path module for resolving file paths
const {Worker} = require('worker_threads');
const path = require('path');

class ThreadManager {
    constructor(numThreads = 4) {
        this.workerPath = path.resolve(__dirname, 'workerTemplate.js'); // Path to the worker script
        this.numThreads = numThreads; // Number of worker threads to create
        this.workers = []; // Array to hold active worker threads
        this.taskQueue = []; // Queue to hold pending tasks
        this.activeTasks = 0; // Counter for active tasks being processed
        this.shuttingDown = false; // Flag to track shutdown state
        console.log("numThreads", numThreads);

        // Create the specified number of worker threads
        for (let i = 0; i < numThreads; i++) {
            console.log("createWorker");
            this.createWorker();
        }
    }

    // Method to create a new worker thread
    createWorker() {
        const worker = new Worker(this.workerPath); // Create a new worker thread using the specified script
        // Set up event listeners for the worker thread
        worker.on('message', (result) => this.handleWorkerResult(worker, result)); // Handle successful task completion
        worker.on('error', (err) => this.handleWorkerError(worker, err)); // Handle errors from the worker
        worker.on('exit', (code) => this.handleWorkerExit(worker, code)); // Handle worker exit events
        this.workers.push(worker); // Add the worker to the list of active workers
    }

    // Handle the result returned by a worker thread
    handleWorkerResult(worker, result) {
        this.activeTasks--; // Decrease the count of active tasks
        worker.currentTask = null; // Clear the current task from the worker
        this.assignTask(worker); // Assign the next task to this worker
        this.checkAndShutdown(); // Check if all tasks are complete and shutdown if needed
    }

    // Handle errors encountered by a worker thread
    handleWorkerError(worker, err) {
        console.error(`Worker encountered an error: ${err}`);
        this.activeTasks--; // Decrease the count of active tasks
        worker.currentTask = null; // Clear the current task from the worker
        this.assignTask(worker); // Assign the next task to this worker
        this.checkAndShutdown(); // Check if all tasks are complete and shutdown if needed
    }

    // Handle worker exit events
    handleWorkerExit(worker, code) {
        this.workers = this.workers.filter(w => w !== worker); // Remove the exited worker from the list
        // If not shutting down and there are fewer workers than specified, create a new worker
        if (!this.shuttingDown && this.workers.length < this.numThreads) {
            this.createWorker();
        }
        this.checkAndShutdown(); // Check if all tasks are complete and shutdown if needed
    }

    // Add a task to the task queue
    addTask(taskData) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({taskData, resolve, reject}); // Add the task to the queue with its promise handlers
            this.assignTask(); // Attempt to assign the task to an available worker
        });
    }

    // Assign a task from the queue to an available worker
    assignTask(worker) {
        // Check if there are tasks in the queue and if there are available workers
        if (this.taskQueue.length === 0 || this.activeTasks >= this.workers.length) {
            return;
        }

        // If no specific worker is given, find an available worker that is not currently processing a task
        if (!worker) {
            worker = this.workers.find(w => !w.currentTask);
        }

        // If a worker is found and there are tasks to assign
        if (worker && this.taskQueue.length > 0) {
            const task = this.taskQueue.shift(); // Get the next task from the queue
            this.activeTasks++; // Increment the count of active tasks
            worker.currentTask = task; // Assign the task to the worker
            worker.once('message', task.resolve); // Resolve the promise when the task completes
            worker.once('error', task.reject); // Reject the promise if an error occurs
            worker.postMessage(task.taskData); // Send the task data to the worker thread
        }
    }

    // Check if all tasks are complete and shutdown the manager if needed
    checkAndShutdown() {
        if (this.shuttingDown && this.activeTasks === 0 && this.workers.length === 0) {
            console.log('All tasks completed. Shutting down ThreadManager.');
            this.shutdown(); // Call the shutdown method if all tasks are complete
        }
    }

    // Shut down all worker threads
    shutdown() {
        console.log('Shutting down all workers...');
        this.shuttingDown = true; // Set the shutdown flag to prevent creating new workers
        this.workers.forEach(worker => worker.terminate()); // Terminate all active workers
        this.workers = []; // Clear the list of workers
        console.log('ThreadManager has been shut down.');
    }
}

// Export the ThreadManager class
module.exports = ThreadManager;
