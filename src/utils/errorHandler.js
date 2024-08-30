/**
 * Description:
 * This file implements the ErrorHandler class, which is responsible for handling various types of errors
 * in the application, such as syntax errors, type errors, range errors, and general errors. It also manages
 * uncaught exceptions and unhandled promise rejections, logs them using a logger, and can optionally notify
 * administrators using a notifier.
 *
 * Purpose of the File:
 * - Handle and log different types of errors.
 * - Notify administrators when critical errors occur.
 * - Manage unhandled promise rejections and uncaught exceptions.
 * - Attach error handling to global process events.
 */

class ErrorHandler {
    constructor(logger, notifier = null) {
        this.logger = logger; // Logger instance for logging errors
        this.notifier = notifier;  // Optional notifier for sending alerts (e.g., email, SMS)
    }

    // Main method to handle different types of errors
    handleError(error) {
        // Check the type of the error and delegate to the appropriate handler
        if (error instanceof SyntaxError) {
            this.handleSyntaxError(error); // Handle syntax errors
        } else if (error instanceof TypeError) {
            this.handleTypeError(error); // Handle type errors
        } else if (error instanceof RangeError) {
            this.handleRangeError(error); // Handle range errors
        } else {
            this.handleGeneralError(error); // Handle general errors
        }
    }

    // Handle syntax errors
    handleSyntaxError(error) {
        this.logger.error(`Syntax Error: ${error.message}`); // Log the error message
        this.notifyAdmin(error); // Notify administrators if notifier is set
    }

    // Handle type errors
    handleTypeError(error) {
        this.logger.error(`Type Error: ${error.message}`); // Log the error message
        this.notifyAdmin(error); // Notify administrators if notifier is set
    }

    // Handle range errors
    handleRangeError(error) {
        this.logger.error(`Range Error: ${error.message}`); // Log the error message
        this.notifyAdmin(error); // Notify administrators if notifier is set
    }

    // Handle general errors that do not match specific types
    handleGeneralError(error) {
        this.logger.error(`Error: ${error.message}`); // Log the error message
        this.notifyAdmin(error); // Notify administrators if notifier is set
    }

    // Handle unhandled promise rejections
    handlePromiseRejection(reason, promise) {
        this.logger.error(`Unhandled Promise Rejection: ${reason}`); // Log the rejection reason
        this.notifyAdmin(reason); // Notify administrators if notifier is set
    }

    // Handle uncaught exceptions
    handleUncaughtException(error) {
        this.logger.error(`Uncaught Exception: ${error.message}`); // Log the uncaught exception
        this.notifyAdmin(error); // Notify administrators if notifier is set
        process.exit(1); // Exit the process with an error code
    }

    // Notify administrators about critical errors if a notifier is set
    notifyAdmin(error) {
        if (this.notifier) {
            this.notifier.send(`Critical Error: ${error.message}`, error.stack); // Send the error message and stack trace
        }
    }

    // Attach global error handlers for unhandled rejections and uncaught exceptions
    attachHandlers() {
        // Attach handler for unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            this.handlePromiseRejection(reason, promise); // Delegate handling to the promise rejection handler
        });

        // Attach handler for uncaught exceptions
        process.on('uncaughtException', (error) => {
            this.handleUncaughtException(error); // Delegate handling to the uncaught exception handler
        });
    }
}

// Export the ErrorHandler class
module.exports = ErrorHandler;
