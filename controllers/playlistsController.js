const axios = require('axios');
const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const { route } = require('.');

const db = require('../models');
// const { create } = require('../models/User'); 



// ----------------- GET index
router.get('/', (req, res) => {
  db.Playlist.find({}, (err, allPlaylists) => {
  if (err) return console.log(err);
  const context = {
      playlists: allPlaylists,
  };
    res.render('playlists/index', context);
  })
});


// Do we need to pass the info about the user's id?
// ----------------- GET new
router.get('/new', (req, res) => {
  res.render('playlists/new');
});


// ----------------- CREATE user playlist
router.post('/', (req, res) => {
  db.Playlist.create({
    title: req.body.title,
    description: req.body.description,
    user: req.body.userId,
  }, (err, playlist) => {
    if (err) return console.log(err);
    res.status(200).json(playlist);

    res.redirect(`/playlists/${playlist._id}`);
  })
})


// ----------------- PUT (UPDATE & EDIT) movieIds for existing playlists
router.put('/:id', (req, res) => {
  db.Playlist.findById(req.params.id, (err, playlist) => {
    //This will contain our array of movies the user has chosen;
    playlist.movieIDs = req.body.movieChoices
    // Will need to revisit for views implementation
    playlist.save();

    res.redirect(`/playlist/${req.params.id}`);

    return res.status(200).json(playlist);
  })
})

// ----------------- GET routes to edit playlist page
router.get('/:id/edit', (req, res) => {
  db.Playlist.findById(req.params.id, (err, playlistToEdit) => {
    if (err) return console.log(err);
    
    const context = {
      playlist: playlistToEdit
    }
  
    res.render(`playlist/${req.params.id}/edit`, context);
  })
})


// ----------------- GET playlists for existing users
router.get('/users/:id', async (req, res) => {
  let playlists = await db.Playlist.find({ user: req.params.id})
    res.json(playlists);

})

// ----------------- GET (SHOW) - movie details (description, poster path, voting average)
// playlist/ids/movies
router.get('/:id/movies', async (req, res) => {
  // Below, we are finding the movie ids for a playlist
  let playlist = await db.Playlist.findById(req.params.id);
  let movieDetails = [];
  // For every movie id, we are making a request to the moviedb api for its
  // movie details. 
  for (let i = 0; i < playlist.movieIDs.length; i++) {
    let movieID = playlist.movieIDs[i];
    let response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, {
      params: {
        api_key: '64bbb4feb014546a2feb336e5e661f16'
      }
    })
    movieDetails.push(response.data); 
    // response."data" is axios' standard way of delivering data back to us
  };
  res.json(movieDetails);
})



// ----------------- DELETE playlist
router.delete('/:id', async (req, res) => {
  await db.Playlist.findByIdAndDelete(req.params.id);
    res.json({msg: "Finished"})
})

module.exports = router;