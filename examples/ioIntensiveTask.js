// IO intensive task example
/**
 * Description:
 * This file demonstrates an example of using SimpleAPI for executing I/O intensive tasks,
 * such as reading large files and fetching data from a network API. The SimpleAPI is configured
 * to handle multiple I/O tasks concurrently using threads. The code showcases how to set up the API,
 * define I/O tasks, add them to the task queue, execute them, and clean up resources afterward.
 *
 * Purpose of the File:
 * - Configure settings for managing I/O intensive tasks.
 * - Define and handle I/O operations such as file reading and API requests.
 * - Add tasks to a queue for parallel processing.
 * - Execute I/O tasks using the configured API.
 * - Shutdown the API and clean up resources after task execution.
 */
const SimpleAPI = require('../src/api/simpleAPI');
const fs = require('fs').promises;
const axios = require('axios');

// 1. Initial configuration settings
const options = {
    logLevel: 'info',   // Set logging level to 'info'
    maxThreads: 4,      // Use 4 threads for processing I/O tasks
};

// Initialize SimpleAPI with specified options
const api = new SimpleAPI(options);

// 2. Define I/O tasks (reading files and making network requests)
async function readLargeFile(filePath) {
    console.log(`Reading file: ${filePath}`);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return `File content length: ${data.length}`;
    } catch (error) {
        // Handle file reading errors
        throw new Error(`Error reading file: ${error.message}`);
    }
}

async function fetchDataFromAPI(url) {
    console.log(`Fetching data from URL: ${url}`);
    try {
        const response = await axios.get(url);
        return `Fetched data length: ${JSON.stringify(response.data).length}`;
    } catch (error) {
        // Handle API fetching errors
        throw new Error(`Error fetching data: ${error.message}`);
    }
}

// 3. Add I/O tasks to the queue
api.addTask({type: 'io', action: 'readFile', data: 'path/to/large/file.txt'});
api.addTask({type: 'io', action: 'fetchAPI', data: 'https://jsonplaceholder.typicode.com/posts'});

// 4. Execute the I/O tasks
api.executeTask();
api.executeTask();

// 5. Shutdown and clean up resources
api.shutdown();
