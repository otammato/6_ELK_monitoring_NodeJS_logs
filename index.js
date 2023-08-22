const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const supplier = require("./app/controller/supplier.controller");
const mustacheExpress = require("mustache-express");
const favicon = require('serve-favicon');
const { config, mainLogger } = require('./config.js');

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

app.get("/", (req, res) => {
    res.render("home", {});
});

app.get("/suppliers/", (req, res) => {
    supplier.findAll(req, res);
});

app.get("/supplier-add", (req, res) => {
    res.render("supplier-add", {});
});

app.post("/supplier-add", (req, res) => {
    supplier.create(req, res);
});

app.get("/supplier-update/:id", (req, res) => {
    supplier.findOne(req, res);
});

app.post("/supplier-update", (req, res) => {
    supplier.update(req, res);
});

app.post("/supplier-remove/:id", (req, res) => {
    supplier.remove(req, res);
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
