/**
 * Description:
 * This file implements the SimpleParallelManager, which provides a simplified interface for managing
 * and executing tasks using the ParallelManager. It integrates a TaskQueue and sets up ParallelManager
 * with options for threading and processing. The SimpleParallelManager allows running tasks with specified
 * priority and execution method, monitoring the task queue status, and shutting down the manager.
 *
 * Purpose of the File:
 * - Provide a simplified manager for executing tasks using threading and processing.
 * - Run tasks with specified priority and execution method (threads or processes).
 * - Monitor task queue status.
 * - Shut down the manager and clean up resources.
 */

// Import dependencies for ParallelManager and TaskQueue
const ParallelManager = require("./index");
const TaskQueue = require("../core/taskQueue");

class SimpleParallelManager {
    constructor(options = {}) {
        // Initialize task queue with provided options
        const taskQueue = new TaskQueue(options.queueOptions);

        // Initialize ParallelManager with threading, processing, and logging options
        this.parallelManager = new ParallelManager({
            threadOptions: options.numThreads || 4,       // Number of threads to use
            processOptions: options.numProcesses || 2,   // Number of processes to use
            logger: options.logger || console,           // Logger to use for output
        });
    }

    // Method to run a task with specified priority and execution method (threads or processes)
    async runTask(taskData, priority = 0, useThreads = true) {
        try {
            console.log("runTask", taskData); // Debug log for task execution
            // Add the task to the manager and execute it
            return await this.parallelManager.addTask(taskData, priority, useThreads);
        } catch (error) {
            // Handle errors during task execution
            console.error('Error executing task:', error);
            throw error; // Rethrow the error after logging
        }
    }

    // Method to shut down the manager and clean up resources
    shutdown() {
        this.parallelManager.shutdown(); // Call shutdown on the parallel manager
    }

    // Method to get the current status of the task queue
    getQueueStatus() {
        return this.parallelManager.getQueueStatus(); // Get the queue status from the parallel manager
    }
}

// Export the SimpleParallelManager class
module.exports = SimpleParallelManager;
