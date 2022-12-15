const express = require("express");
const fs = require("fs");
const url = require("url");
const zlib = require("zlib");
const cors = require("cors");

const port = 5001;

const app = express();
app.options("*", cors());
app.use(express.static(__dirname));
const server = app.listen(port);

console.info("server started");


