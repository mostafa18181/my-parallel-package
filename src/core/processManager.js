const {cpus} = require("node:os");
const {resolve} = require("node:path");
const {fork} = require('child_process');

class ProcessManager {
    constructor(options = {}) {
        this.maxProcesses = options.maxProcesses || cpus().length;
        this.minProcesses = options.minProcesses || 1;
        this.processPath = resolve(__dirname, 'workerprocess.js');
        this.processes = [];
        this.taskQueue = [];
        this.activeTasks = 0;

        this.initializeProcesses();
    }

    initializeProcesses() {
        console.log('Initializing processes...');
        for (let i = 0; i < this.minProcesses; i++) {
            this.createProcess();
        }
    }

    createProcess() {
        console.log('Creating a new process...');
        const child = fork(this.processPath);

        child.on('message', (result) => this.handleProcessResult(child, result));
        child.on('error', (err) => this.handleProcessError(child, err));
        child.on('exit', (code) => this.handleProcessExit(child, code));

        this.processes.push(child);
    }

    handleProcessResult(child, result) {
        console.log(`Result from worker: ${JSON.stringify(result)}`);
        this.activeTasks--;
        this.assignTaskToProcess(child);
    }

    handleProcessError(child, err) {
        console.error(`Process encountered an error: ${err}`);
        this.processes = this.processes.filter(proc => proc !== child);
        this.createProcess();
    }

    handleProcessExit(child, code) {
        console.log(`Process exited with code ${code}`);
        this.processes = this.processes.filter(proc => proc !== child);

        if (this.shuttingDown) {
            return;
        }

        if (this.activeTasks > 0 || this.processes.length < this.minProcesses) {
            this.createProcess();
        }
    }

    addTask(taskData) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({taskData, resolve, reject});
            this.assignTaskToProcess();
        });
    }

    assignTaskToProcess(child) {
        if (this.taskQueue.length === 0 || this.activeTasks >= this.processes.length) {
            return;
        }

        if (!child) {
            child = this.processes.find(proc => proc.connected);
        }

        if (child && this.taskQueue.length > 0) {
            const {taskData, resolve, reject} = this.taskQueue.shift();
            this.activeTasks++;

            child.once('message', resolve);
            child.once('error', reject);
            console.log(`Sending task to worker: ${taskData}`);
            child.send(taskData);
        }
    }

    shutdown() {
        console.log('Shutting down all processes...');
        this.shuttingDown = true;
        this.processes.forEach(proc => proc.kill());
    }
}

module.exports = ProcessManager;
