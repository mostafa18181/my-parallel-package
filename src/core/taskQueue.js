// // taskQueue implementation
// const {Mutex} = require('async-mutex'); // استفاده از یک کتابخانه برای مدیریت قفل‌ها
//
// class TaskQueue {
//     constructor(options = {}) {
//         this.queue = [];
//         this.maxRetries = options.maxRetries || 3;
//         this.timestampEnabled = options.timestampEnabled || false;
//         this.mutex = new Mutex(); // برای مدیریت همزمانی
//     }
//
//     async addTask(taskData, priority = 0) {
//         const task = {
//             data: taskData,
//             priority,
//             retries: 0,
//             timestamp: this.timestampEnabled ? Date.now() : null
//         };
//         const release = await this.mutex.acquire(); // قفل را بگیرید
//         try {
//             this.queue.push(task);
//             this.queue.sort((a, b) => b.priority - a.priority);
//         } finally {
//             release(); // قفل را آزاد کنید
//         }
//     }
//
//     async getNextTask() {
//         const release = await this.mutex.acquire(); // قفل را بگیرید
//         try {
//             const task = this.queue.shift();
//             if (this.timestampEnabled && task) {
//                 const waitTime = Date.now() - task.timestamp;
//                 console.log(`Task waited for ${waitTime}ms`);
//             }
//             return task;
//         } finally {
//             release(); // قفل را آزاد کنید
//         }
//     }
//
//     async retryTask(task) {
//         if (task.retries < this.maxRetries) {
//             task.retries += 1;
//             await this.addTask(task.data, task.priority);
//         } else {
//             console.warn(`Task failed after ${this.maxRetries} retries:`, task.data);
//         }
//     }
//
//     isEmpty() {
//         return this.queue.length === 0;
//     }
//
//     clearQueue() {
//         this.queue = [];
//     }
//
//     getTaskStatus(task) {
//         return this.queue.includes(task) ? 'Pending' : 'Not Found';
//     }
//
//     cancelTask(taskData) {
//         this.queue = this.queue.filter(task => task.data !== taskData);
//     }
//
//     getQueueStats() {
//         return {
//             totalTasks: this.queue.length,
//             pendingTasks: this.queue.length,
//         };
//     }
// }
//
// module.exports = TaskQueue;
const {Mutex} = require('async-mutex');

class TaskQueue {
    constructor(options = {}) {
        this.queue = [];
        this.maxRetries = options.maxRetries || 3;
        this.timestampEnabled = options.timestampEnabled || false;
        this.mutex = new Mutex();
    }

    async addTask(taskData, priority = 0) {
        const task = {
            data: taskData,
            priority,
            retries: 0,
            timestamp: this.timestampEnabled ? Date.now() : null
        };
        const release = await this.mutex.acquire();
        try {
            this.queue.push(task);
            this.queue.sort((a, b) => b.priority - a.priority);
        } finally {
            release();
        }
    }

    async getNextTask() {
        const release = await this.mutex.acquire();
        try {
            const task = this.queue.shift();
            if (this.timestampEnabled && task) {
                const waitTime = Date.now() - task.timestamp;
                console.log(`Task waited for ${waitTime}ms`);
            }
            return task;
        } finally {
            release();
        }
    }

    async assignTaskToWorkerOrProcess(workersOrProcesses) {
        const release = await this.mutex.acquire();
        try {
            for (const workerOrProcess of workersOrProcesses) {
                if (workerOrProcess.isAvailable() && this.queue.length > 0) {
                    const task = this.queue.shift();
                    workerOrProcess.assignTask(task);
                }
            }
        } finally {
            release();
        }
    }

    clearQueue() {
        this.queue = [];
    }

    getQueueStats() {
        return {
            totalTasks: this.queue.length,
            pendingTasks: this.queue.length,
        };
    }
}

module.exports = TaskQueue;
