/**
 * Description:
 * This file implements the TaskQueue, which is responsible for managing tasks in a queue with priority handling,
 * concurrency control, and task assignment to workers or processes. The queue uses a mutex to ensure thread safety
 * when adding, retrieving, or assigning tasks. It supports task prioritization, retries, and optional timestamping
 * for tracking task wait times.
 *
 * Purpose of the File:
 * - Manage a prioritized task queue with concurrency control.
 * - Safely add and retrieve tasks using a mutex to avoid race conditions.
 * - Assign tasks to available workers or processes.
 * - Track task statistics and manage the task queue.
 */

// Import the Mutex class from the async-mutex package to manage concurrent access to the task queue
const {Mutex} = require('async-mutex');

class TaskQueue {
    constructor(options = {}) {
        this.queue = [];                                   // Array to store the task queue
        this.maxRetries = options.maxRetries || 3;         // Maximum number of retries for a task
        this.timestampEnabled = options.timestampEnabled || false; // Enable timestamping for tasks
        this.mutex = new Mutex();                          // Mutex to manage concurrent access to the queue
    }

    // Method to add a task to the queue with priority handling
    async addTask(taskData, priority = 0) {
        // Create a task object with data, priority, retries, and optional timestamp
        const task = {
            data: taskData,
            priority,
            retries: 0,
            timestamp: this.timestampEnabled ? Date.now() : null // Add timestamp if enabled
        };

        // Acquire the mutex lock before modifying the queue
        const release = await this.mutex.acquire();
        try {
            this.queue.push(task);                          // Add the task to the queue
            this.queue.sort((a, b) => b.priority - a.priority); // Sort tasks by priority (higher first)
        } finally {
            release();                                      // Release the mutex lock
        }
    }

    // Method to retrieve the next task from the queue
    async getNextTask() {
        // Acquire the mutex lock before accessing the queue
        const release = await this.mutex.acquire();
        try {
            const task = this.queue.shift();                // Remove the first task from the queue
            if (this.timestampEnabled && task) {            // If timestamping is enabled, calculate wait time
                const waitTime = Date.now() - task.timestamp;
                console.log(`Task waited for ${waitTime}ms`);
            }
            return task;                                    // Return the retrieved task
        } finally {
            release();                                      // Release the mutex lock
        }
    }

    // Method to assign tasks to available workers or processes
    async assignTaskToWorkerOrProcess(workersOrProcesses) {
        // Acquire the mutex lock before assigning tasks
        const release = await this.mutex.acquire();
        try {
            // Iterate over available workers or processes
            for (const workerOrProcess of workersOrProcesses) {
                // Check if the worker or process is available and there are tasks in the queue
                if (workerOrProcess.isAvailable() && this.queue.length > 0) {
                    const task = this.queue.shift();       // Remove the next task from the queue
                    workerOrProcess.assignTask(task);      // Assign the task to the worker or process
                }
            }
        } finally {
            release();                                      // Release the mutex lock
        }
    }

    // Method to clear all tasks from the queue
    clearQueue() {
        this.queue = [];                                    // Empty the queue array
    }

    // Method to get statistics about the task queue
    getQueueStats() {
        return {
            totalTasks: this.queue.length,                  // Total number of tasks in the queue
            pendingTasks: this.queue.length,                // Number of tasks pending execution
        };
    }
}

// Export the TaskQueue class
module.exports = TaskQueue;
