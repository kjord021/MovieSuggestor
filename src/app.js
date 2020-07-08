const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html")

});

app.post("/", function(req, res) {
  const searchText = req.body.movieName;

  const apikey = "f00dfae4";
  const url = ("https://www.omdbapi.com/?apikey=f00dfae4&s=" + searchText);

  fetch(url)
  .then(response => response.json())
  .then(data =>{
    console.log(data);

    for (i = 0; i < data.Search.length; i++){
      res.write("<div class='container'><center> <h3>" + data.Search[i].Title + "</h3> </center>");
      res.write("<center><button><img src=" + data.Search[i].Poster + "></center></button>");

    }
    res.write("</div>")
    res.send();
  });

});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
