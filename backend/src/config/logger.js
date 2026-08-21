const env = require('./env');

const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
const CURRENT_LEVEL = env.isDev ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

const timestamp = () => new Date().toISOString();

const logger = {
  error: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(`[${timestamp()}] [ERROR]`, ...args);
    }
  },
  warn: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(`[${timestamp()}] [WARN]`, ...args);
    }
  },
  info: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.INFO) {
      console.log(`[${timestamp()}] [INFO]`, ...args);
    }
  },
  debug: (...args) => {
    if (CURRENT_LEVEL >= LOG_LEVELS.DEBUG) {
      console.log(`[${timestamp()}] [DEBUG]`, ...args);
    }
  },
};

module.exports = logger;
