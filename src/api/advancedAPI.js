// advancedAPI implementation
const ParallelManager = require('./index');

class AdvancedAPI {
    constructor(options = {}) {
        this.manager = new ParallelManager(options);
    }

    addTask(taskData, options = {}) {
        const priority = options.priority || 0;
        const useThreads = options.useThreads !== undefined ? options.useThreads : true;
        const retries = options.retries !== undefined ? options.retries : 0;
        const scheduledTime = options.scheduledTime || null;

        const taskOptions = {priority, retries, scheduledTime};
        this.manager.addTask({...taskData, taskOptions}, priority, useThreads);
    }

    executeTask(taskData, options = {}) {
        const useThreads = options.useThreads !== undefined ? options.useThreads : true;
        this.manager.executeNextTask(useThreads);
    }

    cancelTask(taskData) {
        this.manager.cancelTask(taskData);
    }

    getQueueStatus() {
        return this.manager.getQueueStatus();
    }

    configureThreads(options) {
        this.manager.threadManager.configure(options);
    }

    configureProcesses(options) {
        this.manager.processManager.configure(options);
    }

    shutdown() {
        this.manager.shutdown();
    }

    // مکانیزم پیشرفته برای مدیریت خطاها
    handleError(taskData, error) {
        // پیاده‌سازی مدیریت خطاهای پیشرفته مانند لاگینگ و اطلاع‌رسانی
        console.error(`Error in task: ${taskData}, Error: ${error}`);
    }

    // پیگیری وضعیت دقیق‌تر وظایف
    trackTaskStatus(taskData) {
        // پیاده‌سازی مکانیزمی برای ردیابی دقیق‌تر وظایف
        const status = this.manager.getTaskStatus(taskData);
        console.log(`Status of task: ${taskData}: ${status}`);
        return status;
    }
}

module.exports = AdvancedAPI;
