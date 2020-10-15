const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const db = require('../models');

const moment = require('moment');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('users/login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  let recentPlaylists = await db.Playlist.find().sort({createdAt: -1}).limit(5);
  console.log(recentPlaylists)
  db.Playlist.find({user: req.user._id}, (err, allPlaylists) => {
    if (err) return console.log(err);
    const context = {
        userPlaylists: allPlaylists,
        user: req.user,
        moment,
        recentPlaylists
    };
    res.render('dashboard', context)
  })
})


module.exports = router;