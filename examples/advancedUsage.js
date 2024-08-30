// Advanced usage example for AdvancedAPI
/**
 * Description:
 * This file provides an advanced usage example of the AdvancedAPI,
 * which is designed to manage complex and advanced tasks in a Node.js environment.
 * The AdvancedAPI allows you to execute tasks concurrently using multiple threads
 * and processes. It includes features for error handling, task prioritization,
 * runtime configuration adjustments, and resource cleanup.
 *
 * Purpose of the File:
 * - Configure advanced settings for managing heavy computational and I/O tasks.
 * - Define and handle complex tasks.
 * - Add tasks to a queue and execute them concurrently with various settings.
 * - Monitor the status of the task queue.
 * - Dynamically adjust API settings during runtime.
 * - Terminate the API and clean up resources.
 */

const AdvancedAPI = require('../src/api/advancedAPI');

// 1. Advanced configuration settings
const options = {
    logLevel: 'debug',  // Logging level set to debug for detailed insights
    maxThreads: 8,      // Using 8 threads for heavy computations
    maxProcesses: 4,    // Using 4 processes for independent tasks
    queueOptions: {
        maxRetries: 3,  // Retry tasks up to 3 times in case of errors
    },
};

// Initialize the AdvancedAPI with the specified options
const api = new AdvancedAPI(options);

// 2. Define complex and advanced tasks
function heavyComputation(input) {
    console.log('Running heavy computation task with input:', input);
    return input.reduce((acc, val) => acc + Math.pow(val, 2), 0);
}

async function complexDataFetching(url) {
    console.log('Fetching complex data from URL:', url);
    try {
        const response = await require('axios').get(url);
        const processedData = response.data.map(item => item.id * 2);
        return `Processed data: ${JSON.stringify(processedData)}`;
    } catch (error) {
        api.logger.error(`Error fetching data from ${url}: ${error.message}`);
        api.logger.info('Retrying the task...');
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
}

function processTask(task) {
    switch (task.action) {
        case 'heavyComputation':
            return heavyComputation(task.data);
        case 'complexDataFetch':
            return complexDataFetching(task.data);
        default:
            throw new Error('Unknown task action');
    }
}

// 3. Add advanced tasks to the queue
api.addTask({type: 'compute', action: 'heavyComputation', data: [10, 20, 30, 40]});
api.addTask({type: 'io', action: 'complexDataFetch', data: 'https://jsonplaceholder.typicode.com/posts'});

// 4. Execute multiple tasks concurrently with priority settings
api.executeTask({useThreads: true, priority: 'high'});
api.executeTask({useThreads: false, priority: 'low'});

// 5. Check the queue status and review results
console.log('Queue Status:', api.getQueueStatus());

// 6. Adjust settings dynamically during runtime
api.configureThreads({maxThreads: 12});  // Increase the number of threads for heavier tasks
api.configureProcesses({maxProcesses: 6});  // Increase the number of processes for I/O intensive tasks

// 7. Add more tasks after configuration changes
api.addTask({type: 'compute', action: 'heavyComputation', data: [50, 60, 70, 80]});
api.executeTask({useThreads: true});

// 8. Shut down and clean up resources
api.shutdown();
