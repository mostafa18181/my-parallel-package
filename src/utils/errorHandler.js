// errorHandler implementation
class ErrorHandler {
    constructor(logger, notifier = null) {
        this.logger = logger;
        this.notifier = notifier;  // اضافه کردن یک نوتیفایر برای ارسال هشدارها
    }

    handleError(error) {
        if (error instanceof SyntaxError) {
            this.handleSyntaxError(error);
        } else if (error instanceof TypeError) {
            this.handleTypeError(error);
        } else if (error instanceof RangeError) {
            this.handleRangeError(error);
        } else {
            this.handleGeneralError(error);
        }
    }

    handleSyntaxError(error) {
        this.logger.error(`Syntax Error: ${error.message}`);
        this.notifyAdmin(error);
    }

    handleTypeError(error) {
        this.logger.error(`Type Error: ${error.message}`);
        this.notifyAdmin(error);
    }

    handleRangeError(error) {
        this.logger.error(`Range Error: ${error.message}`);
        this.notifyAdmin(error);
    }

    handleGeneralError(error) {
        this.logger.error(`Error: ${error.message}`);
        this.notifyAdmin(error);
    }

    handlePromiseRejection(reason, promise) {
        this.logger.error(`Unhandled Promise Rejection: ${reason}`);
        this.notifyAdmin(reason);
    }

    handleUncaughtException(error) {
        this.logger.error(`Uncaught Exception: ${error.message}`);
        this.notifyAdmin(error);
        process.exit(1);
    }

    notifyAdmin(error) {
        if (this.notifier) {
            this.notifier.send(`Critical Error: ${error.message}`, error.stack);
        }
    }

    attachHandlers() {
        process.on('unhandledRejection', (reason, promise) => {
            this.handlePromiseRejection(reason, promise);
        });

        process.on('uncaughtException', (error) => {
            this.handleUncaughtException(error);
        });
    }
}

module.exports = ErrorHandler;
