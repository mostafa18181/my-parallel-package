// logger implementation
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Logger {
    constructor(options = {}) {
        this.logLevel = options.logLevel || 'info';
        this.logFilePath = options.logFilePath || null;
        this.consoleLogging = options.consoleLogging !== undefined ? options.consoleLogging : true;
        this.format = options.format || 'text'; // 'text' or 'json'
        this.colors = options.colors || false;

        if (this.logFilePath) {
            this.logStream = fs.createWriteStream(this.logFilePath, {flags: 'a'});
        }
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = this.formatLogMessage(timestamp, level, message);

        if (this.shouldLog(level)) {
            if (this.consoleLogging) {
                console.log(this.colors ? this.colorize(logMessage, level) : logMessage);
            }
            if (this.logStream) {
                this.logStream.write(logMessage + '\n');
            }
        }
    }

    formatLogMessage(timestamp, level, message) {
        if (this.format === 'json') {
            return JSON.stringify({timestamp, level, message});
        }
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    colorize(message, level) {
        switch (level) {
            case 'info':
                return chalk.blue(message);
            case 'warn':
                return chalk.yellow(message);
            case 'error':
                return chalk.red(message);
            case 'debug':
                return chalk.green(message);
            default:
                return message;
        }
    }

    info(message) {
        this.log(message, 'info');
    }

    warn(message) {
        this.log(message, 'warn');
    }

    error(message) {
        this.log(message, 'error');
    }

    debug(message) {
        this.log(message, 'debug');
    }

    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    setLogLevel(level) {
        this.logLevel = level;
    }

    close() {
        if (this.logStream) {
            this.logStream.end();
        }
    }
}

module.exports = Logger;
