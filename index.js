const express = require('express');
const bunyan = require('bunyan');
const logstashStream = require('bunyan-logstash-tcp').createStream({
  host: '172.20.0.3',  // Replace 'logstash' with the hostname or IP of your Logstash container.
  port: 5000,  // Use the same port as specified in the Logstash configuration.
});
const bodyParser = require("body-parser");
const cors = require("cors");
const supplier = require("./app/controller/supplier.controller");
const app = express();
const mustacheExpress = require("mustache-express");
const favicon = require('serve-favicon');
const app_port = process.env.APP_PORT || 3000;

const bunyanDebugStream = require('bunyan-debug-stream');

const log = bunyan.createLogger({
  name: 'combined-log',
  streams: [
    {
      path: './logs.log', // Original file stream (optional)
    },
    {
      level: 'debug',
      stream: process.stdout,
    },
    {
      level: 'debug',
      type: 'raw',
      stream: logstashStream,
    },
  ],
  level: 'debug',
});

const logRequests = (req, res, next) => {
  log.info(`${req.method} ${req.url}`);
  next();
};

app.use(logRequests);

app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.options("*", cors());
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static('public'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

// APP endpoints
app.get("/", (req, res) => {
  log.info("Routes: GET /: Home route which renders a homepage.");
  res.render("home", {});
});

app.get("/suppliers/", (req, res) => {
  log.info("Routes: GET /suppliers/: Lists all suppliers.");
  supplier.findAll(req, res);
});

app.get("/supplier-add", (req, res) => {
  log.info("Routes: GET /supplier-add: Displays the form to add a new supplier.");
  res.render("supplier-add", {});
});

app.post("/supplier-add", (req, res) => {
  log.info("Routes: POST /supplier-add: Endpoint to add a new supplier.");
  supplier.create(req, res);
});

app.get("/supplier-update/:id", (req, res) => {
  log.info(`Routes: GET /supplier-update/${req.params.id}: Displays the form to update a supplier with a specific ID.`);
  supplier.findOne(req, res);
});

app.post("/supplier-update", (req, res) => {
  log.info("Routes: POST /supplier-update: Endpoint to update the supplier details.");
  supplier.update(req, res);
});

app.post("/supplier-remove/:id", (req, res) => {
  log.info(`Routes: POST /supplier-remove/${req.params.id}: Endpoint to remove a supplier with a specific ID.`);
  supplier.remove(req, res);
});

// handle 404
app.use(function (req, res, next) {
  log.debug("error 404 event");
  res.status(404).render("404", {});
});

// set port, listen for requests

app.listen(app_port, () => {
  console.log(`Server is running on port ${app_port}.`);
  log.info(`Server is running on port ${app_port}!`);
});

