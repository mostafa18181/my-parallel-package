/**
 * Description:
 * This file implements the AdvancedAPI, which is designed to manage advanced task execution
 * using a ParallelManager. The AdvancedAPI provides a higher-level interface for adding,
 * executing, canceling, and managing tasks, with options for thread and process configuration.
 * It also includes advanced error handling and task tracking mechanisms.
 *
 * Purpose of the File:
 * - Create an advanced API for task management using ParallelManager.
 * - Add tasks with specific options like priority, retries, and scheduled execution.
 * - Execute tasks using threads or processes based on configuration.
 * - Monitor and track the status of tasks in the queue.
 * - Handle errors with logging and notifications.
 * - Adjust thread and process settings dynamically.
 * - Clean up resources upon shutdown.
 */

// advancedAPI implementation
const ParallelManager = require('./index');

class AdvancedAPI {
    constructor(options = {}) {
        // Initialize the ParallelManager with provided options
        this.manager = new ParallelManager(options);
    }

    // Add a task to the manager with specific options
    addTask(taskData, options = {}) {
        const priority = options.priority || 0; // Set task priority
        const useThreads = options.useThreads !== undefined ? options.useThreads : true; // Determine if threads should be used
        const retries = options.retries !== undefined ? options.retries : 0; // Number of retry attempts
        const scheduledTime = options.scheduledTime || null; // Schedule task execution time

        const taskOptions = {priority, retries, scheduledTime}; // Combine task options
        this.manager.addTask({...taskData, taskOptions}, priority, useThreads);
    }

    // Execute the next task in the queue using specified options
    executeTask(taskData, options = {}) {
        const useThreads = options.useThreads !== undefined ? options.useThreads : true; // Use threads if specified
        this.manager.executeNextTask(useThreads);
    }

    // Cancel a specific task
    cancelTask(taskData) {
        this.manager.cancelTask(taskData);
    }

    // Get the current status of the task queue
    getQueueStatus() {
        return this.manager.getQueueStatus();
    }

    // Configure thread settings dynamically
    configureThreads(options) {
        this.manager.threadManager.configure(options);
    }

    // Configure process settings dynamically
    configureProcesses(options) {
        this.manager.processManager.configure(options);
    }

    // Shutdown the manager and clean up resources
    shutdown() {
        this.manager.shutdown();
    }

    // Advanced error handling mechanism
    handleError(taskData, error) {
        // Implement advanced error management like logging and notifications
        console.error(`Error in task: ${taskData}, Error: ${error}`);
    }

    // Track the detailed status of specific tasks
    trackTaskStatus(taskData) {
        // Implement a mechanism for detailed task tracking
        const status = this.manager.getTaskStatus(taskData);
        console.log(`Status of task: ${taskData}: ${status}`);
        return status;
    }
}

module.exports = AdvancedAPI;
