const axios = require('axios');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const db = require('../models');


// ----------------- GET new playlist
router.get('/new', (req, res) => {
  res.render('playlists/new');
});


// ----------------- CREATE playlist
router.post('/', async (req, res) => {
  // parse apart strings sent from form 
  let parsedMovieIds = req.body.movieIdString.split(',')
  parsedMovieIds.pop();
  try {
    db.Playlist.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user._id,
    }, async (err, playlist) => {
      if (err) {
        res.render('/404');
        return console.log(err);
      }
      // make api call
      for (let i = 0; i < parsedMovieIds.length; i++) {
        let movieID = parsedMovieIds[i];
        try {
          let response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, {
            params: {
              api_key: '64bbb4feb014546a2feb336e5e661f16'
            }
          })
          // push movie object into Playlist model
          const movieGenres = [];
          response.data.genres.forEach(genre => {
            movieGenres.push(genre.name);
          })
          db.Movie.create({
            title: response.data.title,
            overview: response.data.overview,
            posterPath: response.data.poster_path,
            genres: movieGenres,
            runtime: response.data.runtime,
            tagline: response.data.tagline,
            voteAverage: response.data.vote_average,
            tmdbID: response.data.id
          }, (err, newMovie) => {
            if (err) return console.log(err);

            db.Playlist.findById(playlist._id, async (err, foundPlaylist) => {
              if (err) {
                res.render('404');
                return console.log(err);
              }
              foundPlaylist.movieIDs.push(newMovie._id); 
              foundPlaylist.save();
            })
          })
        }
        catch(err) {
          res.render('404');
          console.log('in show playlist function', err.message);
        }
      }
      res.redirect(`/playlists/${playlist._id}`);
    })
  }
  catch(err) {
    res.render('/404');
    return console.log(err.message);
  }
})




// ----------------- GET (SHOW) - movie details (description, poster path, voting average)
router.get('/:playlistId', (req, res) => {
  db.Playlist.findById(req.params.playlistId)
    .populate('movieIDs')
    .exec((err, playlist) => {
      if (err) return console.log(err);
      const context = {
        playlist,
        moment
      }
      console.log(playlist)
      res.render('playlists/show', context);
  })
})


// ----------------- GET similar playlist
router.get('/:playlistId/similar', async (req, res) => {
  try {
    let playlist = await db.Playlist.findById(req.params.playlistId)
    const similarMovies = [];
    let movieString = '';
    for (let i = 0; i < playlist.movieIDs.length; i++) {
      let movieID = playlist.movieIDs[i];
      try {
        let response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}/similar`, {
            params: { 
                api_key: '64bbb4feb014546a2feb336e5e661f16',
            }
        })
        let randomIndex = Math.floor(Math.random() * response.data.results.length)
        let chosenMovie = response.data.results[randomIndex];
        while (similarMovies.indexOf(chosenMovie) !== -1) {
          randomIndex = Math.floor(Math.random() * response.data.results.length)
          chosenMovie = response.data.results[randomIndex];
        }
        similarMovies.push(chosenMovie);
        movieString += chosenMovie.id + ',';
      }
      catch(err) {
        console.log(err);
        res.render('/404')
      }
    }
    const context = {
      similarMovies,
      playlist,
      movieString
    }
    res.render('playlists/similar', context);
  }
  catch(err) {
    res.render('/404');
    return console.log(err);
  }
})



// ----------------- PUT (UPDATE & EDIT) movieIds for existing playlists
router.put('/:playlistId', (req, res) => {
  db.Playlist.findById(req.params.playlistId, (err, playlist) => {
    if (err) {
      res.render('/404');
      return console.log(err);
    }
    // parse apart strings sent from form
    const newMovieIds = [];
    let parsedMovieIds = req.body.movieChoices.split(',')
    parsedMovieIds.pop();
    parsedMovieIds.forEach(movieId => {
      newMovieIds.push(movieId);
    });

    playlist.movieIDs = newMovieIds;
    playlist.save();

    const context = {
      playlist,
    }
    
    res.redirect(`/playlists/${playlist.id}`);
  })
})



// ----------------- GET routes to edit playlist page

router.get('/:playlistId/edit', (req, res) => {
  db.Playlist.findById(req.params.playlistId)
    .populate('movieIDs')
    .exec((err, playlist) => {
      if (err) return console.log(err);
      const context = {
        playlist: playlist,
      }
      res.render('playlists/edit', context);
    })
})



// ----------------- DELETE playlist
router.delete('/:playlistID', async (req, res) => {
  try {
    await db.Playlist.findByIdAndDelete(req.params.playlistID);
    res.redirect('/dashboard')
  }
  catch(err) {
    res.render('/404');
    return console.log(err);
  }
})




module.exports = router;