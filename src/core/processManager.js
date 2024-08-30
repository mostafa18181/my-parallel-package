/**
 * Description:
 * This file implements the ProcessManager, which is responsible for managing tasks using child processes.
 * It dynamically creates and manages worker processes to handle task execution. The ProcessManager includes
 * methods for initializing processes, handling task assignments, managing process errors and exits, and
 * shutting down all processes.
 *
 * Purpose of the File:
 * - Manage task execution using child processes.
 * - Initialize and create worker processes.
 * - Handle task assignments to available processes.
 * - Manage process errors, restarts, and exits.
 * - Shut down all processes and clean up resources.
 */

// Import required modules for handling OS information, paths, and child processes
const {cpus} = require("node:os");          // Import CPU information to determine the number of cores
const {resolve} = require("node:path");     // Import path resolution utility
const {fork} = require('child_process');    // Import fork function to create child processes

class ProcessManager {
    constructor(options = {}) {
        // Set the maximum and minimum number of processes
        this.maxProcesses = options.maxProcesses || cpus().length; // Default to the number of CPU cores
        this.minProcesses = options.minProcesses || 1;             // Minimum number of processes to start
        this.processPath = resolve(__dirname, 'workerprocess.js'); // Path to the worker process script
        this.processes = [];                                       // Array to store active processes
        this.taskQueue = [];                                       // Queue to store pending tasks
        this.activeTasks = 0;                                      // Counter for active tasks

        // Initialize the processes
        this.initializeProcesses();
    }

    // Initialize the minimum number of processes
    initializeProcesses() {
        console.log('Initializing processes...');
        for (let i = 0; i < this.minProcesses; i++) {
            this.createProcess(); // Create processes up to the minimum specified
        }
    }

    // Create a new worker process
    createProcess() {
        console.log('Creating a new process...');
        const child = fork(this.processPath); // Fork a new process based on the worker script

        // Set up event handlers for the worker process
        child.on('message', (result) => this.handleProcessResult(child, result)); // Handle successful task completion
        child.on('error', (err) => this.handleProcessError(child, err));          // Handle errors from the worker
        child.on('exit', (code) => this.handleProcessExit(child, code));          // Handle process exit events

        // Add the new process to the list of active processes
        this.processes.push(child);
    }

    // Handle the result returned by a worker process
    handleProcessResult(child, result) {
        console.log(`Result from worker: ${JSON.stringify(result)}`);
        this.activeTasks--;                       // Decrease the count of active tasks
        this.assignTaskToProcess(child);          // Assign the next task to this process
    }

    // Handle errors encountered by a worker process
    handleProcessError(child, err) {
        console.error(`Process encountered an error: ${err}`);
        this.processes = this.processes.filter(proc => proc !== child); // Remove the faulty process from the list
        this.createProcess();                                           // Create a new process to replace the faulty one
    }

    // Handle process exit events
    handleProcessExit(child, code) {
        console.log(`Process exited with code ${code}`);
        this.processes = this.processes.filter(proc => proc !== child); // Remove the exited process from the list

        // If shutting down, do not replace the process
        if (this.shuttingDown) {
            return;
        }

        // Create a new process if active tasks remain or the number of processes is below the minimum
        if (this.activeTasks > 0 || this.processes.length < this.minProcesses) {
            this.createProcess();
        }
    }

    // Add a task to the queue and try to assign it to a process
    addTask(taskData) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({taskData, resolve, reject}); // Add the task to the queue with its promise handlers
            this.assignTaskToProcess();                         // Attempt to assign the task to an available process
        });
    }

    // Assign a task from the queue to an available process
    assignTaskToProcess(child) {
        // Check if there are tasks in the queue and if there are available processes
        if (this.taskQueue.length === 0 || this.activeTasks >= this.processes.length) {
            return;
        }

        // If no specific process is given, find an available connected process
        if (!child) {
            child = this.processes.find(proc => proc.connected);
        }

        // If a connected process is found and there are tasks to assign
        if (child && this.taskQueue.length > 0) {
            const {taskData, resolve, reject} = this.taskQueue.shift(); // Get the next task from the queue
            this.activeTasks++;                                           // Increment the count of active tasks

            // Set up event handlers for task completion and errors
            child.once('message', resolve); // Resolve the promise when the task completes
            child.once('error', reject);    // Reject the promise if an error occurs
            console.log(`Sending task to worker: ${taskData}`);
            child.send(taskData);           // Send the task data to the worker process
        }
    }

    // Shut down all active processes
    shutdown() {
        console.log('Shutting down all processes...');
        this.shuttingDown = true;            // Set the shutdown flag to prevent process replacements
        this.processes.forEach(proc => proc.kill()); // Kill all active processes
    }
}

// Export the ProcessManager class
module.exports = ProcessManager;
