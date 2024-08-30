/**
 * Description:
 * This file implements a worker template script that uses Node.js worker threads to process tasks.
 * It listens for tasks sent via the parentPort, processes them, and sends the results back. If an error
 * occurs during task processing, it logs the error and exits with an error code.
 *
 * Purpose of the File:
 * - Listen for tasks from the parent thread.
 * - Process received tasks and send results back.
 * - Handle and log errors during task processing.
 * - Log worker exit events.
 */

// Import parentPort from the worker_threads module to communicate with the parent thread
const {parentPort} = require('worker_threads');

// Listen for messages (tasks) sent from the parent thread
parentPort.on('message', (taskData) => {
    console.log(`workerTemplate.js: Received taskData: ${taskData}`); // Log the received task data

    try {
        // Simulate task processing (Replace with actual task logic)
        console.log(`workerTemplate.js: Processing task: ${taskData}`); // Log the task being processed
        const result = `Processed: ${taskData}`; // Simulate processing and create a result

        // Send the processed result back to the parent thread
        parentPort.postMessage(result);
        console.log(`workerTemplate.js: Result sent successfully for task: ${taskData}`); // Log success message
    } catch (error) {
        // Handle errors that occur during task processing
        console.error(`workerTemplate.js: Error occurred while processing task: ${taskData}`, error); // Log the error
        process.exit(1);  // Exit the process with an error code to indicate failure
    }
});

// Listen for the exit event to log when the worker exits
process.on('exit', (code) => {
    console.log(`workerTemplate.js: Worker is exiting with code ${code}`); // Log the exit code when the worker exits
});
