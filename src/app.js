const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html")

});

app.get("/index.html", function(req, res){

  res.sendFile(__dirname + "/index.html")

});

app.post("/", function(req, res) {
  const searchText = req.body.movieName;

  const apikey = "f00dfae4";
  const url = ("https://www.omdbapi.com/?apikey="+ apikey +"&s=" + searchText);

  fetch(url)
  .then(response => response.json())
  .then(data =>{
    console.log(data);

    res.write("<body style='background-color:#222'> <br>")

    for (i = 0; i < data.Search.length; i++){

      const movieTitle = data.Search[i].Title;
      const movieID = data.Search[i].imdbID;
      const movieImage = data.Search[i].Poster;
      const movieURL = ("http://www.omdbapi.com/?apikey="+ apikey + "&i=" + movieID + "&plot=full")


      res.write("<div class='container'><center> <h3 style='color:white'>" + movieTitle + "</h3> </center>");
      res.write("<center><button><img src=" + movieImage + "></center></button>");

    }
    res.write("</div></body>")
    res.send();
  });

});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
