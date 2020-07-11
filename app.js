const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const ejs = require("ejs");

const app = express();
const movies = [];
const apikey = "f00dfae4";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', "ejs");

app.get("/", function(req, res) {

  res.render("index", {
    movies: movies
  });

});


app.post("/", function(req, res) {

  while(movies.length > 0){
    movies.pop();
  }

  const searchText = req.body.movieName;

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

          const movie = {
            title: movieTitle,
            id: movieID,
            image: movieImage,
            url: movieURL,
          };
          movies.push(movie);

        }
        res.redirect("/");
      } else {
        res.redirect("/404");
      }

    });
});

app.get("/movies/:postName", function(req, res) {

  const requestedTitle = req.params.postName;

  const movieInformation = {
    title: "",
    yearReleased: "",
    runtime: "",
    genre: "",
    director: "",
    actors: "",
    plot: "",
    rating: "",
    image: ""
  };

  for (var i = 0; i < movies.length; i++) {
    if (movies[i].id === requestedTitle) {

      const movieURL = ("http://www.omdbapi.com/?apikey=" + apikey + "&i=" + movies[i].id + "&plot=full")

      movieInformation.title = movies[i].title;
      movieInformation.image = movies[i].image;

      fetch(movieURL)
        .then(resp => resp.json())
        .then(movieData => {
          console.log("Found movie by ID " + requestedTitle + " retrieving results.");
          movieInformation.yearReleased = movieData.Year;
          movieInformation.runtime = movieData.Runtime;
          movieInformation.genre = movieData.Genre;
          movieInformation.director = movieData.Director;
          movieInformation.actors = movieData.Actors;
          movieInformation.plot = movieData.Plot;
          movieInformation.rating = movieData.imdbRating;

          res.render("movie", {
            movieInformation: movieInformation
          });

        });
    }
  }
});




app.get("/404", function(req, res) {
  res.render("404", {});
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});
