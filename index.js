const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const supplier = require("./app/controller/supplier.controller");
const mustacheExpress = require("mustache-express");
const favicon = require('serve-favicon');
const { config, mainLogger } = require('./app/config/config.js');

const app = express();
const app_port = process.env.APP_PORT || 3000;

// Create a child logger for app-related logs.
// This differentiates logs coming from the app versus the configuration.
const appLogger = mainLogger.child({ source: 'app' });

// Overriding console methods to integrate with our Bunyan logger
// This ensures that any console log, warn, debug, or error call
// gets captured by Bunyan and is sent to the appropriate streams.
console.log = (...args) => {
    appLogger.info(args.join(' '));
};

console.error = (...args) => {
    appLogger.error(args.join(' '));
};

console.warn = (...args) => {
    appLogger.warn(args.join(' '));
};

console.debug = (...args) => {
    appLogger.debug(args.join(' '));
};

// Middleware to log every incoming request.
// It captures the HTTP method and the requested URL.
const logRequests = (req, res, next) => {
    appLogger.info(`${req.method} ${req.url}`);
    next();
};

app.use(logRequests);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static('public'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

// Various routes for the app with associated logging statements.

// APP endpoints
app.get("/", (req, res) => {
  appLogger.info("Routes: GET /: Home route which renders a homepage.");
  res.render("home", {});
});

app.get("/suppliers/", (req, res) => {
  appLogger.info("Routes: GET /suppliers/: Lists all suppliers.");
  supplier.findAll(req, res);
});

app.get("/supplier-add", (req, res) => {
  appLogger.info("Routes: GET /supplier-add: Displays the form to add a new supplier.");
  res.render("supplier-add", {});
});

app.post("/supplier-add", (req, res) => {
  appLogger.info("Routes: POST /supplier-add: Endpoint to add a new supplier.");
  supplier.create(req, res);
});

app.get("/supplier-update/:id", (req, res) => {
  appLogger.info(`Routes: GET /supplier-update/${req.params.id}: Displays the form to update a supplier with a specific ID.`);
  supplier.findOne(req, res);
});

app.post("/supplier-update", (req, res) => {
  appLogger.info("Routes: POST /supplier-update: Endpoint to update the supplier details.");
  supplier.update(req, res);
});

app.post("/supplier-remove/:id", (req, res) => {
  appLogger.info(`Routes: POST /supplier-remove/${req.params.id}: Endpoint to remove a supplier with a specific ID.`);
  supplier.remove(req, res);
});

// handle 404
app.use(function (req, res, next) {
  appLogger.debug("error 404 event");
  res.status(404).render("404", {});
});

// Handle 404 errors and log them
app.use(function(req, res, next) {
    appLogger.debug("error 404 event");
    res.status(404).render("404", {});
});

// Starting the server and logging the event
app.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}.`);
});
