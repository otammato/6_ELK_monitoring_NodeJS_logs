'use strict';
let Logger = require('./src/logger/logger');
let Timer = require('./src/timer/timer');
let isNamespaceEnabled = require('./src/enabled/enabled');

/**
 * @param namespace
 * @param options
 * @returns {Logger}
 */
function logFactory(namespace, options) {
  return new Logger(namespace, isNamespaceEnabled(
    logFactory.getNamespaces(), namespace
  ), options);
}

logFactory.Logger = Logger;
logFactory.Timer = Timer;
logFactory.getNamespaces = function() {
  return process.env.DEBUG || '';
};

module.exports = logFactory;
