# Parallel Task Management System

A high-performance task management system in Node.js, designed to efficiently execute tasks in parallel using multiple
threads and processes.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
    - [SimpleParallelManager Example](#simpleparallelmanager-example)
    - [AdvancedAPI Example](#advancedapi-example)
- [Configuration](#configuration)
- [Components](#components)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [License](#license)

## Introduction

This project provides a robust and scalable task management system capable of executing tasks concurrently. It uses both
threading and processing techniques to optimize performance, making it ideal for complex applications requiring parallel
task execution.

## Features

- **Parallel Task Execution:** Execute tasks concurrently using threads and processes.
- **Task Prioritization:** Tasks can be prioritized, ensuring that critical tasks are executed first.
- **Advanced Error Handling:** Comprehensive error handling mechanisms with customizable logging.
- **Flexible Configuration:** Easily configurable via environment variables and configuration files.
- **Simple API:** Provides a simple and intuitive API for integrating into your applications.

---

## Usage

Here's an example of how to use the `SimpleParallelManager`:

### Example

This example demonstrates the initial setup, task execution, error handling, and shutdown process using `SimpleParallelManager`.

```javascript
// Import the SimpleParallelManager from the package
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
```

### Key Steps Explained

1. **Initial Setup**: SimpleParallelManager is initialized with specific settings for threads and processes. You can configure the number of threads and processes according to your needs.
   
2. **Task Execution**: Multiple tasks are executed asynchronously with different priorities and execution methods (threads or processes). The `runTask` method takes three parameters: task data, priority, and whether to use threads (true) or processes (false).

3. **Error Handling**: Any errors during task execution are caught and logged, ensuring that your application handles failures gracefully.

4. **Shutdown**: After all tasks are completed, the manager is shut down, freeing resources and ensuring that no background tasks are left running.

## Configuration Options

- `numThreads`: The number of threads to use for parallel task execution.
- `numProcesses`: The number of processes to use for task execution.
- `logger`: The logger to use for logging messages (default is `console`).


## Installation

To install the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/mostafa18181/my-parallel-package
cd my-parallel-package
npm install
# my-parallel-package
