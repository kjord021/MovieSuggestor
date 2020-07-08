const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
