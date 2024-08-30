/**
 * Description:
 * This file implements the configuration setup for the application. It loads default settings
 * and merges them with environment-specific configurations if available. The configuration values
 * can be influenced by environment variables or configuration files, making the application adaptable
 * to different environments (e.g., development, production).
 *
 * Purpose of the File:
 * - Load default configuration settings.
 * - Merge environment-specific settings from JSON files.
 * - Provide configuration values to other parts of the application.
 */

// Import path and fs modules for file system operations
const path = require('path'); // Module for working with file and directory paths
const fs = require('fs'); // Module for file system operations

// Determine the environment, defaulting to 'development' if not set
const env = process.env.NODE_ENV || 'development';

// Load default settings
let config = {
    env, // Current environment (development, production, etc.)
    logLevel: process.env.LOG_LEVEL || 'info', // Log level (e.g., debug, info, warn, error)
    logFilePath: process.env.LOG_FILE_PATH || path.resolve(__dirname, 'logs', 'app.log'), // Log file path
    maxThreads: parseInt(process.env.MAX_THREADS, 10) || require('os').cpus().length, // Maximum number of threads
    maxProcesses: parseInt(process.env.MAX_PROCESSES, 10) || require('os').cpus().length, // Maximum number of processes
    idleTimeout: parseInt(process.env.IDLE_TIMEOUT, 10) || 60000, // Idle timeout in milliseconds
    useColors: process.env.USE_COLORS !== undefined ? process.env.USE_COLORS === 'true' : true, // Enable or disable colored logs
    format: process.env.LOG_FORMAT || 'text', // Log format (e.g., text, json)
};

// Load environment-specific settings from a JSON file if it exists
const configFilePath = path.resolve(__dirname, `config.${env}.json`); // Resolve the path for the environment config file
if (fs.existsSync(configFilePath)) { // Check if the environment-specific configuration file exists
    const envConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8')); // Read and parse the JSON configuration file
    config = {...config, ...envConfig}; // Merge the environment-specific settings with the default configuration
}

// Export the final configuration object
module.exports = config;
