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

    if (undefined !== data.Search){

      console.log(data.Search.length + " results found, displaying...");
      res.write(`<body style='background-color:#222'> <br>`);

      for (i = 0; i < data.Search.length; i++){

        const movieTitle = data.Search[i].Title;
        const movieID = data.Search[i].imdbID;
        const movieImage = data.Search[i].Poster;
        const movieURL = ("http://www.omdbapi.com/?apikey="+ apikey + "&i=" + movieID + "&plot=full")

        res.write("<div class='container'><center> <h3 style='color:white'>" + movieTitle + "</h3> </center>");
        res.write("<center><button><img src=" + movieImage + "></center></button>");

        return fetch(movieURL)
        .then(resp => resp.json())
        .then(movieData =>{
          console.log("Found movie by ID " + movieID + " retrieving results.");

          const yearReleased = movieData.Year;
          const runtime = movieData.Runtime;
          const genre = movieData.Genre;
          const director = movieData.Director;
          const actors = movieData.Actors;
          const plot = movieData.Plot;
          const rating = movieData.imdbRating;

           res.write("<h4 style='color:white'><center>Year Released: " + yearReleased + "<br><br>Runtime: " + runtime + "<br><br>Genre: " + genre + "<br><br>Director: " + director + "<br><br>Actors: " + actors + "<br><br>Rating: " + rating + "</center><br><br><div style='margin-left:20%;margin-right:20%;'>Plot: " + plot + "</h4><center><button><a href='index.html'>Search For Another Movie.</a></button></center><br>");

        });



        res.write("</div>");
      }

      res.write("</body>");
      res.send();
    }

    else {
      console.log("No results found.");

      res.write(`<body style='background-color:#222; color:white'><center> <br> <h1> Error 404 </h1> <h3>Movie not found</h3> <div style='margin-left:20%;margin-right:20%;'><h5>Hmmm... this movie doesn't seem to be in our database. We apologize for any inconvience.</div><br><button><a href='index.html'>Search For Another Movie.</a></button></center>`);
    }


  });

});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
