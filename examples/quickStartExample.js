// Quick start example
const SimpleAPI = require('./simpleAPI');

// 1. تنظیمات اولیه
const options = {
    logLevel: 'debug', // سطح لاگینگ
    maxThreads: 4,     // تعداد حداکثر نخ‌ها
    maxProcesses: 2,   // تعداد حداکثر فرآیندها
};

// 2. ایجاد یک نمونه از SimpleAPI
const api = new SimpleAPI(options);

// 3. افزودن یک وظیفه محاسباتی ساده
api.addTask({type: 'compute', data: [1, 2, 3, 4, 5]});

// 4. افزودن یک وظیفه برای دریافت داده‌ها از یک URL
api.addTask({type: 'fetch', data: 'https://jsonplaceholder.typicode.com/posts/1'});

// 5. اجرا و پردازش وظایف
api.executeTask();
api.executeTask();

// 6. دریافت وضعیت صف وظایف
console.log('Queue Status:', api.getQueueStatus());

// 7. لغو یک وظیفه
api.cancelTask({type: 'compute', data: [1, 2, 3, 4, 5]});

// 8. خاتمه دادن و پاکسازی منابع
api.shutdown();
