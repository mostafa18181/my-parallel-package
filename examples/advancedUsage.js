// Advanced usage example
const AdvancedAPI = require('./advancedAPI');

// 1. تنظیمات پیشرفته
const options = {
    logLevel: 'debug',  // ثبت لاگ‌ها در سطح دیباگ برای بررسی دقیق‌تر
    maxThreads: 8,      // استفاده از 8 نخ برای پردازش‌های سنگین
    maxProcesses: 4,    // استفاده از 4 فرآیند برای پردازش‌های مستقل
    queueOptions: {
        maxRetries: 3,  // تلاش مجدد برای وظایف در صورت بروز خطا
    },
};

const api = new AdvancedAPI(options);

// 2. تعریف وظایف پیچیده و پیشرفته
function heavyComputation(input) {
    console.log('Running heavy computation task with input:', input);
    return input.reduce((acc, val) => acc + Math.pow(val, 2), 0);
}

async function complexDataFetching(url) {
    console.log('Fetching complex data from URL:', url);
    try {
        const response = await require('axios').get(url);
        const processedData = response.data.map(item => item.id * 2);
        return `Processed data: ${JSON.stringify(processedData)}`;
    } catch (error) {
        api.logger.error(`Error fetching data from ${url}: ${error.message}`);
        api.logger.info('Retrying the task...');
        throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
}

function processTask(task) {
    switch (task.action) {
        case 'heavyComputation':
            return heavyComputation(task.data);
        case 'complexDataFetch':
            return complexDataFetching(task.data);
        default:
            throw new Error('Unknown task action');
    }
}

// 3. افزودن وظایف پیشرفته به صف
api.addTask({type: 'compute', action: 'heavyComputation', data: [10, 20, 30, 40]});
api.addTask({type: 'io', action: 'complexDataFetch', data: 'https://jsonplaceholder.typicode.com/posts'});

// 4. اجرای همزمان چندین وظیفه با اولویت‌بندی
api.executeTask({useThreads: true, priority: 'high'});
api.executeTask({useThreads: false, priority: 'low'});

// 5. پیگیری وضعیت صف و بررسی نتایج
console.log('Queue Status:', api.getQueueStatus());

// 6. اعمال تغییرات در تنظیمات در زمان اجرا
api.configureThreads({maxThreads: 12});  // افزایش تعداد نخ‌ها برای پردازش‌های سنگین‌تر
api.configureProcesses({maxProcesses: 6});  // افزایش تعداد فرآیندها برای پردازش‌های I/O سنگین

// 7. افزودن وظایف بیشتر پس از تغییرات
api.addTask({type: 'compute', action: 'heavyComputation', data: [50, 60, 70, 80]});
api.executeTask({useThreads: true});

// 8. خاتمه دادن و پاکسازی منابع
api.shutdown();
