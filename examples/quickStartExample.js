/**
 * Description:
 * This file provides a quick start example of using SimpleAPI for managing and executing simple tasks,
 * including computational tasks and fetching data from a URL. The SimpleAPI is set up with basic
 * configurations for threading and processing. This example demonstrates how to set up the API,
 * add tasks to the queue, execute them, monitor the task queue status, cancel tasks, and shut down the API.
 *
 * Purpose of the File:
 * - Configure basic settings for task management using SimpleAPI.
 * - Add simple computational and data-fetching tasks to the queue.
 * - Execute tasks and monitor their status.
 * - Cancel tasks from the queue.
 * - Shutdown the API and clean up resources.
 */

// Quick start example
const SimpleAPI = require('../src/api/simpleAPI');

// 1. Initial configuration settings
const options = {
    logLevel: 'debug', // Set logging level to 'debug'
    maxThreads: 4,     // Maximum number of threads
    maxProcesses: 2,   // Maximum number of processes
};

// 2. Create an instance of SimpleAPI
const api = new SimpleAPI(options);

// 3. Add a simple computational task
api.addTask({type: 'compute', data: [1, 2, 3, 4, 5]});

// 4. Add a task to fetch data from a URL
api.addTask({type: 'fetch', data: 'https://jsonplaceholder.typicode.com/posts/1'});

// 5. Execute tasks
api.executeTask();
api.executeTask();

// 6. Get the status of the task queue
console.log('Queue Status:', api.getQueueStatus());

// 7. Cancel a task
api.cancelTask({type: 'compute', data: [1, 2, 3, 4, 5]});

// 8. Shutdown and clean up resources
api.shutdown();
