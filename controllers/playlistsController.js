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
router.post('/', (req, res) => {
  db.Playlist.create({
    title: req.body.title,
    description: req.body.description,
    user: req.user._id,
    movieIdString: req.body.movieIdString
  }, (err, playlist) => {
    if (err) {
      res.render('/404');
      return console.log(err);
    }
    
    db.Playlist.findById(playlist._id, (err, foundPlaylist) => {
      if (err) {
        res.render('/404');
        return console.log(err);
      }
      // parse apart strings sent from form and push into movieIDs property of Playlist model
      let parsedMovieIds = foundPlaylist.movieIdString.split(',')
      parsedMovieIds = parsedMovieIds.slice(0, parsedMovieIds.length - 1);
      parsedMovieIds.forEach(movieId => {
        foundPlaylist.movieIDs.push(movieId);
      });

      foundPlaylist.save();
    })
    res.redirect(`/playlists/${playlist._id}`);
  })
})


// ----------------- GET (SHOW) - movie details (description, poster path, voting average)
router.get('/:playlistId', async (req, res, next) => {
  try {
    let playlist = await db.Playlist.findById(req.params.playlistId);
    let movieDetails = [];
    for (let i = 0; i < playlist.movieIDs.length; i++) {
      let movieID = playlist.movieIDs[i];
      try {
        let response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, {
        params: {
          api_key: '64bbb4feb014546a2feb336e5e661f16'
        }
        })
        movieDetails.push(response.data); 
      }
      catch(err) {
        res.render('404');
        console.log('in show playlist function', err.message);
      }
    };
    const context = {
      movies: movieDetails,
      playlist: playlist,
      moment
    }
    res.render('playlists/show', context);
  }
  catch(err) {
    console.log(err);
    res.redirect('/404')
  }
})



// // ----------------- PUT (UPDATE & EDIT) movieIds for existing playlists
router.put('/:playlistId', (req, res) => {
  db.Playlist.findById(req.params.playlistId, (err, playlist) => {
    if (err) {
      res.render('/404');
      return console.log(err);
    }
    // parse apart strings sent from form
    const newMovieIds = [];
    let parsedMovieIds = req.body.movieChoices.split(',')
    parsedMovieIds = parsedMovieIds.slice(0, parsedMovieIds.length - 1);
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
router.get('/:playlistId/edit', async (req, res) => {
  try {
    let playlist = await db.Playlist.findById(req.params.playlistId);
    let movieDetails = [];
    for (let i = 0; i < playlist.movieIDs.length; i++) {
      let movieID = playlist.movieIDs[i];
      try {
        let response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, {
        params: {
          api_key: '64bbb4feb014546a2feb336e5e661f16'
        }
        })
        movieDetails.push(response.data); 
      }
      catch(err) {
        console.log(err.message);
        res.render('/404');
      }
    };
    const context = {
      movies: movieDetails,
      playlist: playlist,
    }
    res.render('playlists/edit', context);
  }
  catch(err) {
    console.log(err);
    res.render('/404');
  }
})


// ----------------- DELETE playlist
router.delete('/:playlistID', async (req, res) => {
  try {
    await db.Playlist.findByIdAndDelete(req.params.playlistID);
    res.redirect('/dashboard')
  }
  catch(err) {
    console.log(err);
    res.render('/404');
  }
})




module.exports = router;