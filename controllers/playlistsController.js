const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const db = require('../models');
const { create } = require('../models/User');

// ----------------- CREATE test playlist
router.post('/', (req, res) => {
  db.Playlist.create({
    title: "My Playlist",
    description: "hello",
    user: mongoose.Types.ObjectId(),
  }, (err, playlist) => {
    if (err) return console.log(err);
    const context = {
      playlist: playlist
    };
    res.status(200).json(playlist);
  })
})

// ----------------- PUT (test) movieIds for existing playlists
router.put('/:id', (req, res) => {
  db.Playlist.findById(req.params.id, (err, playlist) => {
    playlist.movieIDs = [337401];
    playlist.save();
    return res.status(200).json(playlist);
  })
})

// ----------------- GET index
router.get('/', (req, res) => {
  db.Playlist.find({}, (err, allPlaylists) => {
  if (err) return console.log(err);
  const context = {
      playlists: allPlaylists,
  };
    res.render('/playlists/index', context);
  })
});


// ----------------- GET new

router.get('/new', (req, res) => {
  res.render('/playlists/new');
});


// ----------------- POST create




// ----------------- GET show




// ----------------- GET edit




// ----------------- PUT update




// ----------------- DELETE delete





module.exports = router;