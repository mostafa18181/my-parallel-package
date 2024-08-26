// // simpleAPI implementation
// const ParallelManager = require('./index');
//
// class SimpleAPI {
//     constructor(options = {}) {
//         this.manager = new ParallelManager(options);
//         this.defaultUseThreads = options.useThreads !== undefined ? options.useThreads : true;
//     }
//
//     addTask(taskData, priority = 0, useThreads = this.defaultUseThreads) {
//         this.manager.addTask(taskData, priority, useThreads);
//     }
//
//     executeTask(useThreads = this.defaultUseThreads) {
//         this.manager.executeNextTask(useThreads);
//     }
//
//     cancelTask(taskData) {
//         this.manager.cancelTask(taskData);
//     }
//
//     getQueueStatus() {
//         return this.manager.getQueueStatus();
//     }
//
//     shutdown() {
//         this.manager.shutdown();
//     }
// }
//
// module.exports = SimpleAPI;
// SimpleParallelManager.js
const ParallelManager = require("./index");
const TaskQueue = require("../core/taskQueue");

class SimpleParallelManager {
    constructor(options = {}) {
        const taskQueue = new TaskQueue(options.queueOptions);
        this.parallelManager = new ParallelManager({
            threadOptions: options.numThreads || 4,
            processOptions: options.numProcesses || 2,
            logger: options.logger || console,
        });
    }

    async runTask(taskData, priority = 0, useThreads = true) {
        try {
            console.log("runTask", taskData)
            return await this.parallelManager.addTask(taskData, priority, useThreads);
        } catch (error) {
            console.error('Error executing task:', error);
            throw error;
        }
    }

    shutdown() {
        this.parallelManager.shutdown();
    }

    getQueueStatus() {
        return this.parallelManager.getQueueStatus();
    }
}

module.exports = SimpleParallelManager;
