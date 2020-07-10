const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const ejs = require("ejs");

const app = express();
const movies = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', "ejs");

app.get("/", function(req, res) {

  res.render("index", {
    movies: movies
  });

  while (movies.length > 0) {
    movies.pop();
  }

});

app.get("/404", function(req, res){
  res.render("404", {
  });
});

app.post("/404", function(req,res){
  redirect("/");
});

app.post("/", function(req, res) {

  while (movies.length > 0) {
    movies.pop();
  }

  const searchText = req.body.movieName;

  const apikey = "f00dfae4";
  const url = ("https://www.omdbapi.com/?apikey=" + apikey + "&s=" + searchText);

  fetch(url)
    .then(response => response.json())
    .then(data => {

      if (undefined !== data.Search) {

        console.log(data.Search.length + " results found, displaying the top result...");

        for (i = 0; i < data.Search.length; i++) {

          const movieTitle = data.Search[i].Title;
          const movieID = data.Search[i].imdbID;
          const movieImage = data.Search[i].Poster;
          const movieURL = ("http://www.omdbapi.com/?apikey=" + apikey + "&i=" + movieID + "&plot=full")

          return fetch(movieURL)
            .then(resp => resp.json())
            .then(movieData => {
              console.log("Found movie by ID " + movieID + " retrieving results.");

              const yearReleased = movieData.Year;
              const runtime = movieData.Runtime;
              const genre = movieData.Genre;
              const director = movieData.Director;
              const actors = movieData.Actors;
              const plot = movieData.Plot;
              const rating = movieData.imdbRating;

              const movie = {
                title: movieTitle,
                id: movieID,
                image: movieImage,
                url: movieURL,
                year: yearReleased,
                genre: genre,
                runtime: runtime,
                director: director,
                actors: actors,
                plot: plot,
                rating: rating
              };
              movies.push(movie);
              res.redirect("/");
            });
        }


      } else {
        res.redirect("/404");
      }
    });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
