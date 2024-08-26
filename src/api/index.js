const ThreadManager = require('../core/threadManager');
const ProcessManager = require('../core/processManager');
const TaskQueue = require('../core/taskQueue');

class ParallelManager {
    constructor(options = {}) {
        this.options = options;
        this.threadManager = new ThreadManager(this.options.threadOptions);
        this.processManager = new ProcessManager(this.options.processOptions);
        this.taskQueue = new TaskQueue(this.options.queueOptions);
        this.logger = options.logger || console;
    }

    addTask(taskData, priority = 0, useThreads = true) {
        console.log("pre", taskData);

        this.taskQueue.addTask(taskData, priority);

        this.logger.log(`Task added with priority ${priority}. Using Threads: ${useThreads}`);

        return new Promise((resolve, reject) => {
            if (useThreads) {
                console.log("addtask", taskData);
                let m = this.threadManager.addTask(taskData)
                    .then(resolve)
                    .catch(reject);
                console.log(m)

            } else {
                this.processManager.addTask(taskData)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    async executeNextTask(useThreads = true) {
        const nextTask = await this.taskQueue.getNextTask();
        if (!nextTask) {
            this.logger.log('No tasks in the queue');
            return;
        }

        this.logger.log(`Executing task with priority ${nextTask.priority}. Using Threads: ${useThreads}`);
        if (useThreads) {
            this.threadManager.addTask(nextTask.data, nextTask.priority)
                .then(result => console.log(`Task result: ${result}`))
                .catch(error => console.error(`Task error: ${error}`));
        } else {
            this.processManager.addTask(nextTask.data, nextTask.priority)
                .then(result => console.log(`Task result: ${result}`))
                .catch(error => console.error(`Task error: ${error}`));
        }
    }

    shutdown() {
        this.logger.log('Shutting down all managers and clearing the queue.');
        this.threadManager.shutdown();
        this.processManager.shutdown();
        this.taskQueue.clearQueue();
    }

    getQueueStatus() {
        const status = this.taskQueue.getQueueStats();
        this.logger.log('Queue Status:', status);
        return status;
    }

    cancelTask(taskData) {
        this.taskQueue.cancelTask(taskData);
        this.logger.log('Task cancelled:', taskData);
    }
}

module.exports = ParallelManager;
