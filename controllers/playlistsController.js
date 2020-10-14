const axios = require('axios');
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
    res.render('playlists/index', context);
  })
});


// ----------------- GET new
router.get('/new', (req, res) => {
  res.render('playlists/new');
});


// ----------------- CREATE user playlist
router.post('/', (req, res) => {
  console.log(req.user)
  db.Playlist.create({
    title: req.body.title,
    description: req.body.description,
    user: req.user._id,
    movieIdString: req.body.movieIdString
  }, (err, playlist) => {
    if (err) return console.log(err);

    db.Playlist.findById(playlist._id, (err, foundPlaylist) => {
      if (err) return console.log(err);

      let parsedMovieIds = foundPlaylist.movieIdString.split(',')
      parsedMovieIds = parsedMovieIds.slice(0, parsedMovieIds.length - 1);
      parsedMovieIds.forEach(movieId => {
        foundPlaylist.movieIDs.push(movieId);
      });
      foundPlaylist.save();
    })
    // 
    res.redirect(`/playlists/${playlist._id}/movies`);
    // res.redirect(`/playlists/${playlist._id}`);
  })
})


// ----------------- PUT (UPDATE & EDIT) movieIds for existing playlists
router.put('/:id', (req, res) => {
  db.Playlist.findById(req.params.id, (err, playlist) => {
    //This will contain our array of movies the user has chosen;
    playlist.movieIDs = req.body.movieChoices
    // Will need to revisit for views implementation
    playlist.save();

    const context = {
      playlist,
    }

    res.render(`playlists/${req.params.id}`, context);
  })
})

// The playlist should be visible to everyone but can only be edited by the user... so how do?
// ----------------- GET show playlist
router.get('/:id', (req, res) => {
  db.Playlist.findById(req.params.id, (err, playlist) => {
    // playlist.movieIDs = req.body.movieChoices
    console.log(playlist)

    const context = {
      playlist,
      }
    res.render(`playlists/show`, context);
  })
})


// Only the user the playlist belongs to should be able to edit the playlist
// ----------------- GET routes to edit playlist page
router.get('/:id/edit', (req, res) => {
  db.Playlist.findById(req.params.id, (err, playlistToEdit) => {
    if (err) return console.log(err);
    
    const context = {
      playlist: playlistToEdit
    }
  
    res.render(`playlists/${req.params.id}/edit`, context);
  })
})


// ----------------- GET playlists for existing users

router.get('/users/:id', async (req, res) => {
  let playlists = await db.Playlist.find({ user: req.params.id})
    // res.json(playlists);
    const context = {
      playlist: playlists,
    }
    console.log(playlists)
    // res.render(`playlists/show`, context);
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
    console.log('------- movies object -----------', movieDetails)
    const context = {
      movies: movieDetails,
      playlist: playlist
    }
    res.render('movies/show', context);
    // response."data" is axios' standard way of delivering data back to us
  };
})



// ----------------- DELETE playlist
router.delete('/:id', async (req, res) => {
  await db.Playlist.findByIdAndDelete(req.params.id);
    // res.json({msg: "Finished"})
  res.redirect('/playlists')
})

module.exports = router;