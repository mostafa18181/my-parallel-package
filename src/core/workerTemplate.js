const {parentPort} = require('worker_threads');

parentPort.on('message', (taskData) => {
    console.log(`workerTemplate.js: Received taskData: ${taskData}`);

    try {


        console.log(`workerTemplate.js: Processing task: ${taskData}`);
        const result = `Processed: ${taskData}`;

        parentPort.postMessage(result);
        console.log(`workerTemplate.js: Result sent successfully for task: ${taskData}`);
    } catch (error) {
        console.error(`workerTemplate.js: Error occurred while processing task: ${taskData}`, error);
        process.exit(1);  // خروج با کد خطا
    }
});

process.on('exit', (code) => {
    console.log(`workerTemplate.js: Worker is exiting with code ${code}`);
});
