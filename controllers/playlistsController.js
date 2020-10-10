const express = require('express');
const router = express.Router();

const db = require('../models');

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