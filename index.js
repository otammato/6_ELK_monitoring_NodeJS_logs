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
// list all the suppliers
app.get("/", (req, res) => {
  res.render("home", {});
  // No need to log here since the middleware already logs the request
});

app.get("/suppliers/", supplier.findAll);

app.get("/supplier-add", (req, res) => {
  res.render("supplier-add", {});
  // No need to log here since the middleware already logs the request
});

app.post("/supplier-add", supplier.create);

app.get("/supplier-update/:id", supplier.findOne);

app.post("/supplier-update", supplier.update);

app.post("/supplier-remove/:id", supplier.remove);

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

