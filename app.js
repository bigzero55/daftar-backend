const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const indexRouter = require("./routes/index");

app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", indexRouter);

module.exports = app;
