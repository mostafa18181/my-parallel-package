// Import the SimpleParallelManager from the package
/**
 * Initial Setup: SimpleParallelManager is initialized with specific settings for threads and processes.
 * Task Execution: Multiple tasks are executed asynchronously with different priorities and execution methods (threads or processes).
 * Error Handling: Any errors during task execution are caught and logged.
 * Shutdown: After all tasks are completed, the manager is shut down, freeing resources.
 */
const SimpleParallelManager = require('my-parallel-package/src/api/simpleAPI');

// Initialize the SimpleParallelManager with configuration settings
const simpleManager = new SimpleParallelManager({
    numThreads: 4,        // Use 4 threads for parallel task execution
    numProcesses: 2,      // Use 2 processes for task execution
    logger: console,      // Set the logger to use the console for output
});

// Function to run example tasks
async function runExampleTasks() {
    try {
        // Execute task 1 with priority 1 using threads
        const result1 = await simpleManager.runTask("Task 1", 1, true);
        console.log("Result 1:", result1);

        // Execute task 2 with priority 2 using threads
        const result2 = await simpleManager.runTask("Task 2", 2, true);
        console.log("Result 2:", result2);

        // Execute task 3 with priority 1 using processes
        const result3 = await simpleManager.runTask("Task 3", 1, false);
        console.log("Result 3:", result3);

        // Execute task 4 with priority 3 using processes
        const result4 = await simpleManager.runTask("Task 4", 3, false);
        console.log("Result 4:", result4);

    } catch (error) {
        // Handle any errors that occur during task execution
        console.error('Error in task execution:', error);
    } finally {
        // Shutdown the manager and release resources
        simpleManager.shutdown();
        console.log("All tasks completed and manager shutdown.");
    }
}

// Run the example tasks
runExampleTasks();
