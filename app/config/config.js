const bunyan = require('bunyan');
const logstashStream = require('bunyan-logstash-tcp').createStream({
  host: '172.20.0.3',
  port: 5000,
});

// define default config, but allow overrides from ENV vars
let config = {
  APP_DB_HOST: "localhost",
  APP_DB_USER: "root",
  APP_DB_PORT: "3306",
  APP_DB_PASSWORD: "12345678",
  APP_DB_NAME: "COFFEE"
}

// Creating a logger instance for general logging purposes
const mainLogger = bunyan.createLogger({
  name: 'combined-log',
  streams: [
    {
      path: './logs.log', // Log to a file
    },
    {
      level: 'debug',
      stream: process.stdout, // Log to console
    },
    {
      level: 'debug',
      type: 'raw',
      stream: logstashStream, // Log to Logstash
    },
  ],
  level: 'debug',
});

// Checking each configuration and logging if they are set from ENV or default value
Object.keys(config).forEach(key => {
  if(process.env[key] === undefined) {
    // Logging messages about configuration sourcing
    mainLogger.info(`[NOTICE] Value for key '${key}' not found in ENV, using default value. See app/config/config.js`);
  } else {
    config[key] = process.env[key]
  }
});

module.exports = { config, mainLogger };
