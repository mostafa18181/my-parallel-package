// CPU intensive task example
/**
 * Description:
 * This file demonstrates a usage example of SimpleAPI for executing CPU-intensive tasks,
 * specifically for calculating prime numbers within a specified range. The SimpleAPI is
 * configured to manage heavy computational tasks using multiple threads. This example shows
 * how to set up the API, define a prime number calculation task, add multiple tasks to the queue,
 * execute them, and clean up resources afterward.
 *
 * Purpose of the File:
 * - Configure settings for managing CPU-intensive tasks.
 * - Define and handle computationally heavy tasks like prime number calculation.
 * - Add tasks to a queue for parallel processing.
 * - Execute tasks using the configured API.
 * - Shutdown the API and clean up resources after task execution.
 */

const SimpleAPI = require('./simpleAPI');

// 1. Initial configuration settings
const options = {
    logLevel: 'info',   // Set logging level to 'info'
    maxThreads: 4,      // Use 4 threads for processing tasks
};

// Initialize SimpleAPI with specified options
const api = new SimpleAPI(options);

// 2. Define a heavy computational task (like prime number calculation)
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function findPrimes(start, end) {
    const primes = [];
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    return primes;
}

// 3. Add heavy computational tasks to the queue
api.addTask({type: 'compute', data: {start: 1, end: 100000}});
api.addTask({type: 'compute', data: {start: 100001, end: 200000}});
api.addTask({type: 'compute', data: {start: 200001, end: 300000}});
api.addTask({type: 'compute', data: {start: 300001, end: 400000}});

// 4. Execute the tasks
api.executeTask();
api.executeTask();
api.executeTask();
api.executeTask();

// 5. Shutdown and clean up resources
api.shutdown();
