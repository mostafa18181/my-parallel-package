// IO intensive task example
const SimpleAPI = require('./simpleAPI');
const fs = require('fs').promises;
const axios = require('axios');

// 1. تنظیمات اولیه
const options = {
    logLevel: 'info',
    maxThreads: 4,  // استفاده از 4 نخ برای پردازش وظایف I/O
};

const api = new SimpleAPI(options);

// 2. تعریف وظایف I/O (خواندن فایل و درخواست شبکه‌ای)
async function readLargeFile(filePath) {
    console.log(`Reading file: ${filePath}`);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return `File content length: ${data.length}`;
    } catch (error) {
        throw new Error(`Error reading file: ${error.message}`);
    }
}

async function fetchDataFromAPI(url) {
    console.log(`Fetching data from URL: ${url}`);
    try {
        const response = await axios.get(url);
        return `Fetched data length: ${JSON.stringify(response.data).length}`;
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
}

// 3. افزودن وظایف I/O به صف
api.addTask({type: 'io', action: 'readFile', data: 'path/to/large/file.txt'});
api.addTask({type: 'io', action: 'fetchAPI', data: 'https://jsonplaceholder.typicode.com/posts'});

// 4. اجرای وظایف I/O
api.executeTask();
api.executeTask();

// 5. خاتمه دادن و پاکسازی منابع
api.shutdown();
