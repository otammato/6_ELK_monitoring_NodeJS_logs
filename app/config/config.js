// Importing the bunyan library for structured logging.
const bunyan = require('bunyan');

// Importing the bunyan-logstash-tcp library to send logs to Logstash via TCP.
const logstashStream = require('bunyan-logstash-tcp').createStream({
  host: '172.20.0.3',   // Specify the hostname or IP of the Logstash server.
  port: 5000,           // Specify the port where Logstash is listening.
});

// Creating the main logger with multiple streams.
const mainLogger = bunyan.createLogger({
  name: 'main-log',     // The name of the logger (used to categorize logs).
  streams: [
    {
      // Stream to write logs to a file.
      path: './logs.log',
    },
    {
      // Stream to output logs to the console.
      level: 'debug',
      stream: process.stdout,
    },
    {
      // Stream to send logs to Logstash over TCP.
      level: 'debug',
      type: 'raw',
      stream: logstashStream,
    },
  ],
});

// Creating a child logger for configuration-related logs. This logger will inherit configurations from the main logger.
const configLogger = mainLogger.child({ source: 'config' });

// Default configuration values.
let config = {
  APP_DB_HOST: "localhost",
  APP_DB_USER: "root",
  APP_DB_PORT: "3306",
  APP_DB_PASSWORD: "12345678",
  APP_DB_NAME: "COFFEE"
}

// Iterating over each key in the configuration to check if they're present in the environment variables.
Object.keys(config).forEach(key => {
  if(process.env[key] === undefined){
    // Logging an info message using the configLogger if the environment variable is not defined.
    configLogger.info(`[NOTICE] Value for key '${key}' not found in ENV, using default value. See app/config/config.js`);
  } else {
    config[key] = process.env[key];
  }
});

// Exporting the configuration and mainLogger for use in other modules.
module.exports = {
  config,
  mainLogger
};
