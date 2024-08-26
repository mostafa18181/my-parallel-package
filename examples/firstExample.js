const SimpleParallelManager = require('my-parallel-package/src/api/simpleAPI');

const simpleManager = new SimpleParallelManager({
    numThreads: 4,
    numProcesses: 2,
    logger: console,
});

async function runExampleTasks() {
    try {
        const result1 = await simpleManager.runTask("Task 1", 1, true);
        console.log("Result 1:", result1);

        const result2 = await simpleManager.runTask("Task 2", 2, true);
        console.log("Result 2:", result2);

        const result3 = await simpleManager.runTask("Task 3", 1, false);
        console.log("Result 3:", result3);

        const result4 = await simpleManager.runTask("Task 4", 3, false);
        console.log("Result 4:", result4);

    } catch (error) {
        console.error('Error in task execution:', error);
    } finally {
        simpleManager.shutdown();
        console.log("All tasks completed and manager shutdown.");
    }
}

runExampleTasks();
