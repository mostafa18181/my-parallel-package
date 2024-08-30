/**
 * Description:
 * This file implements a simple worker script that listens for tasks sent from the parent process.
 * Upon receiving a task, it processes the task and sends the result back to the parent process.
 * If an error occurs during processing, the worker catches the error, logs it, and sends an error
 * message back to the parent.
 *
 * Purpose of the File:
 * - Listen for tasks from the parent process.
 * - Simulate task processing and handle results.
 * - Send processed results back to the parent process.
 * - Handle and report errors that occur during task execution.
 */

// Listen for messages (tasks) from the parent process
process.on('message', (taskData) => {
    console.log(`Worker received task: ${taskData}`); // Log the received task
    let result;
    try {
        // Simulate task processing (Replace with actual task logic)
        result = `Processed: ${taskData}`; // Placeholder processing logic
    } catch (error) {
        // Handle errors during task processing
        console.error('Error in worker:', error); // Log the error
        // Send an error message back to the parent process
        process.send({error: error.message});
        return; // Exit the current task processing
    }

    // Log the processed result
    console.log(`Worker sending result: ${result}`);
    // Send the processed result back to the parent process
    process.send({result});
});
