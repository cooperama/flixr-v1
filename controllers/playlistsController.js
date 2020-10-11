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

router.post('/', (req, res) => {
  db.Playlist.create(req.body, (err, newPlaylist) => {
    if (err) return console.log(err);

    db.User.findById(req.body.user, (err, foundUser) => {
      if (err) return console.log(err);

      foundUser.playlists.push(newPlaylist._id);
      res.redirect(`/playlists/${newPlaylist._id}`);
    })
  })
})


// ----------------- GET show

router.get('/:playlistId', (req, res) => {
  db.Playlist.findById(req.params.playlistsId)
    .populate('movies')
    .exec((err, foundPlaylist) => {
      if (err) return console.log(err);

      const context = {
        playlist: foundPlaylist
      }

      res.render('playlists/show', context);
    })
});


// ----------------- GET edit

router.get('/:playlistId/edit', (req, res) => {
  db.Playlist.findById(req.params.playlistsId)
    .populate('movies')
    .exec((err, foundPlaylist) => {
      if (err) return console.log(err);

      const context = {
        playlist: foundPlaylist,
      }

      res.render('playists/edit', context);
    })
})


// ----------------- PUT update

router.put('/:playlistId', (req, res) => {
  db.Playlist.findByIdAndUpdate(
    req.params.playlistsId,
    req.body,
    {new: true},
    (err, updatedPlaylist) => {
      if (err) return console.log(err);

      res.redirect(`/playlists/${updatedPlaylist._id}`);
    }
  )
});


// ----------------- DELETE delete

router.delete('/:playlistId', (req, res) => {
  db.Playlist.findByIdAndDelete(req.params.playlistsId, (err, playlistToDelete) => {
    if (err) return console.log(err);

    db.Movie.deleteMany({_id: {$in: playlistToDelete.movies}}, (err, result) => {
      if (err) return console.log(err);

      res.redirect('/playlists');
    })
  })
});




module.exports = router;