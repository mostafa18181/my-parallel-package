// CPU intensive task example
const SimpleAPI = require('./simpleAPI');

// 1. تنظیمات اولیه
const options = {
    logLevel: 'info',
    maxThreads: 4,  // استفاده از 4 نخ برای پردازش
};

const api = new SimpleAPI(options);

// 2. تعریف یک وظیفه سنگین محاسباتی (مانند محاسبه اعداد اول)
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function findPrimes(start, end) {
    const primes = [];
    for (let i = start; i <= end; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    return primes;
}

// 3. افزودن وظایف سنگین محاسباتی به صف
api.addTask({type: 'compute', data: {start: 1, end: 100000}});
api.addTask({type: 'compute', data: {start: 100001, end: 200000}});
api.addTask({type: 'compute', data: {start: 200001, end: 300000}});
api.addTask({type: 'compute', data: {start: 300001, end: 400000}});

// 4. اجرای وظایف
api.executeTask();
api.executeTask();
api.executeTask();
api.executeTask();

// 5. خاتمه دادن و پاکسازی منابع
api.shutdown();
