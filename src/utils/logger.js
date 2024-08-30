/**
 * Description:
 * This file implements the Logger class, which is responsible for managing log messages in different formats
 * (text or JSON), with options for console logging and file logging. The Logger class supports different log
 * levels (debug, info, warn, error) and allows messages to be colorized when displayed in the console.
 *
 * Purpose of the File:
 * - Log messages at various levels (debug, info, warn, error).
 * - Output log messages to the console and/or a specified file.
 * - Format log messages as text or JSON.
 * - Provide colored output for console logs based on the log level.
 */

const fs = require('fs'); // File system module for writing logs to a file
const path = require('path'); // Path module for handling file paths
const chalk = require('chalk'); // Chalk module for adding colors to console logs

class Logger {
    constructor(options = {}) {
        this.logLevel = options.logLevel || 'info'; // Set the default log level
        this.logFilePath = options.logFilePath || null; // Set the file path for log output, if specified
        this.consoleLogging = options.consoleLogging !== undefined ? options.consoleLogging : true; // Enable/disable console logging
        this.format = options.format || 'text'; // Format of log messages ('text' or 'json')
        this.colors = options.colors || false; // Enable/disable colored log messages

        // If a log file path is provided, create a write stream to the file
        if (this.logFilePath) {
            this.logStream = fs.createWriteStream(this.logFilePath, {flags: 'a'}); // Append mode for log file
        }
    }

    // General logging method that formats and outputs log messages
    log(message, level = 'info') {
        const timestamp = new Date().toISOString(); // Generate a timestamp for the log
        const logMessage = this.formatLogMessage(timestamp, level, message); // Format the log message

        // Check if the current log level allows this message to be logged
        if (this.shouldLog(level)) {
            if (this.consoleLogging) {
                // Log to the console, with optional colorization
                console.log(this.colors ? this.colorize(logMessage, level) : logMessage);
            }
            if (this.logStream) {
                // Write the log message to the log file if a stream is available
                this.logStream.write(logMessage + '\n');
            }
        }
    }

    // Format the log message based on the selected format (text or JSON)
    formatLogMessage(timestamp, level, message) {
        if (this.format === 'json') {
            return JSON.stringify({timestamp, level, message}); // Return JSON-formatted message
        }
        // Return text-formatted message
        return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }

    // Apply color to the log message based on the log level
    colorize(message, level) {
        switch (level) {
            case 'info':
                return chalk.blue(message); // Blue color for 'info' level
            case 'warn':
                return chalk.yellow(message); // Yellow color for 'warn' level
            case 'error':
                return chalk.red(message); // Red color for 'error' level
            case 'debug':
                return chalk.green(message); // Green color for 'debug' level
            default:
                return message; // Default to no color
        }
    }

    // Log an informational message
    info(message) {
        this.log(message, 'info');
    }

    // Log a warning message
    warn(message) {
        this.log(message, 'warn');
    }

    // Log an error message
    error(message) {
        this.log(message, 'error');
    }

    // Log a debug message
    debug(message) {
        this.log(message, 'debug');
    }

    // Determine if the current log level allows logging of the specified level
    shouldLog(level) {
        const levels = ['debug', 'info', 'warn', 'error']; // Define the order of log levels
        // Check if the current level is allowed based on the configured log level
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    // Set the log level dynamically
    setLogLevel(level) {
        this.logLevel = level;
    }

    // Close the log file stream if it exists
    close() {
        if (this.logStream) {
            this.logStream.end(); // End the stream to close the log file
        }
    }
}

// Export the Logger class for use in other parts of the application
module.exports = Logger;
