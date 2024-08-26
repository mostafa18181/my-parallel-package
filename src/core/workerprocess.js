process.on('message', (taskData) => {
    console.log(`Worker received task: ${taskData}`);
    let result;
    try {
        // شبیه‌سازی پردازش تسک (جایگزین کنید با منطق واقعی خودتان)
        result = `Processed: ${taskData}`;
    } catch (error) {
        console.error('Error in worker:', error);
        process.send({error: error.message});
        return;
    }

    console.log(`Worker sending result: ${result}`);
    process.send({result});
});
