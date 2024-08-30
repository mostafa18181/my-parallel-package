/**
 * Description:
 * This file implements the ParallelManager, which is responsible for managing tasks using both threading
 * and processing capabilities. It integrates ThreadManager, ProcessManager, and TaskQueue to handle task
 * execution, prioritization, and management. The ParallelManager allows adding tasks to a queue, executing
 * them using threads or processes, monitoring the queue status, canceling tasks, and shutting down all managers.
 *
 * Purpose of the File:
 * - Manage tasks using threads and processes.
 * - Add tasks to a task queue with priority settings.
 * - Execute tasks using the specified execution method (threads or processes).
 * - Monitor task queue status and manage task cancellations.
 * - Shut down all managers and clear the task queue.
 */

// Import dependencies for managing threads, processes, and task queues
const ThreadManager = require('../core/threadManager');
const ProcessManager = require('../core/processManager');
const TaskQueue = require('../core/taskQueue');

class ParallelManager {
    constructor(options = {}) {
        // Initialize managers and options
        this.options = options;
        this.threadManager = new ThreadManager(this.options.threadOptions);    // Manage thread-based tasks
        this.processManager = new ProcessManager(this.options.processOptions); // Manage process-based tasks
        this.taskQueue = new TaskQueue(this.options.queueOptions);             // Manage task queue
        this.logger = options.logger || console;                              // Set logger to the console if none provided
    }

    // Add a task to the task queue with priority and execution method (threads or processes)
    addTask(taskData, priority = 0, useThreads = true) {
        console.log("pre", taskData); // Debug log for task data before adding

        // Add task to the queue with the specified priority
        this.taskQueue.addTask(taskData, priority);

        // Log the task addition with details
        this.logger.log(`Task added with priority ${priority}. Using Threads: ${useThreads}`);

        // Return a promise to handle task execution based on the specified method
        return new Promise((resolve, reject) => {
            if (useThreads) {
                console.log("addtask", taskData); // Debug log for task addition
                // Execute task using threads
                this.threadManager.addTask(taskData)
                    .then(resolve)  // Resolve promise on success
                    .catch(reject); // Reject promise on error
            } else {
                // Execute task using processes
                this.processManager.addTask(taskData)
                    .then(resolve)  // Resolve promise on success
                    .catch(reject); // Reject promise on error
            }
        });
    }

    // Execute the next task in the queue using threads or processes
    async executeNextTask(useThreads = true) {
        // Get the next task from the queue
        const nextTask = await this.taskQueue.getNextTask();
        if (!nextTask) {
            // Log if no tasks are available in the queue
            this.logger.log('No tasks in the queue');
            return;
        }

        // Log task execution with details
        this.logger.log(`Executing task with priority ${nextTask.priority}. Using Threads: ${useThreads}`);

        // Execute the task using the specified method (threads or processes)
        if (useThreads) {
            this.threadManager.addTask(nextTask.data, nextTask.priority)
                .then(result => console.log(`Task result: ${result}`))     // Log result on success
                .catch(error => console.error(`Task error: ${error}`));   // Log error on failure
        } else {
            this.processManager.addTask(nextTask.data, nextTask.priority)
                .then(result => console.log(`Task result: ${result}`))     // Log result on success
                .catch(error => console.error(`Task error: ${error}`));   // Log error on failure
        }
    }

    // Shut down all managers and clear the task queue
    shutdown() {
        // Log shutdown message
        this.logger.log('Shutting down all managers and clearing the queue.');
        this.threadManager.shutdown();      // Shut down thread manager
        this.processManager.shutdown();     // Shut down process manager
        this.taskQueue.clearQueue();        // Clear task queue
    }

    // Get the current status of the task queue
    getQueueStatus() {
        const status = this.taskQueue.getQueueStats(); // Get queue statistics
        this.logger.log('Queue Status:', status);      // Log the status
        return status;
    }

    // Cancel a specific task from the queue
    cancelTask(taskData) {
        this.taskQueue.cancelTask(taskData);            // Cancel the task in the queue
        this.logger.log('Task cancelled:', taskData);   // Log the cancellation
    }
}

module.exports = ParallelManager;
