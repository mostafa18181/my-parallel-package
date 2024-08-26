// config implementation
const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';

// بارگذاری تنظیمات پیش‌فرض
let config = {
    env,
    logLevel: process.env.LOG_LEVEL || 'info',
    logFilePath: process.env.LOG_FILE_PATH || path.resolve(__dirname, 'logs', 'app.log'),
    maxThreads: parseInt(process.env.MAX_THREADS, 10) || require('os').cpus().length,
    maxProcesses: parseInt(process.env.MAX_PROCESSES, 10) || require('os').cpus().length,
    idleTimeout: parseInt(process.env.IDLE_TIMEOUT, 10) || 60000,
    useColors: process.env.USE_COLORS !== undefined ? process.env.USE_COLORS === 'true' : true,
    format: process.env.LOG_FORMAT || 'text',
};

// بارگذاری تنظیمات محیطی از فایل
const configFilePath = path.resolve(__dirname, `config.${env}.json`);
if (fs.existsSync(configFilePath)) {
    const envConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    config = {...config, ...envConfig};
}

module.exports = config;
