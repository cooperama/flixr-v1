const axios = require('axios');
const express = require('express');
const router = express.Router();

const db = require('../models');


// ----------------- GET index
router.get('/', (req, res) => {
  db.Playlist.find({}, (err, allPlaylists) => {
  if (err) {
    res.render('404');
    return console.log(err);
  }
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
    if (err) {
      res.render('404');
      return console.log(err);
    }

    db.Playlist.findById(playlist._id, (err, foundPlaylist) => {
      if (err) {
        res.render('404');
        return console.log(err);
      }

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


// // ----------------- PUT (UPDATE & EDIT) movieIds for existing playlists
router.put('/:playlistId', (req, res) => {
  db.Playlist.findById(req.params.playlistId, (err, playlist) => {
    if (err) {
      res.render('404');
      return console.log(err);
    }
    //This will contain our array of movies the user has chosen;
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


// Only the user the playlist belongs to should be able to edit the playlist
// ----------------- GET routes to edit playlist page
router.get('/:playlistId/edit', async (req, res) => {
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
      console.log('in edit movies get function', err.message);
    }
  };

  const context = {
    movies: movieDetails,
    playlist: playlist,
  }

  res.render('playlists/edit', context);
})



// // ----------------- GET playlists for existing users

// router.get('/users/:userId', async (req, res) => {
//   try {
//     let playlists = await db.Playlist.find({ user: req.params.userId})
//       const context = {
//         playlist: playlists,
//       }
//       console.log(playlists)
//       // res.render(`playlists/show`, context);
//   }
//   catch(err) {
//     res.render('404');
//   }
// })




// ----------------- GET (SHOW) - movie details (description, poster path, voting average)
router.get('/:playlistId', async (req, res, next) => {
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
  console.log(movieDetails.length)
  const context = {
    movies: movieDetails,
    playlist: playlist
  }

  res.render('playlists/show', context);
})


// ----------------- 
// ----------------- 
// ----------------- 
// Only the user who owns the playlist should be able to delete it??
// ----------------- DELETE playlist
router.delete('/:playlistID', async (req, res) => {
  try {
    await db.Playlist.findByIdAndDelete(req.params.playlistID);
    res.redirect('/playlists')
  }
  catch(err) {
    res.render('404');
  }
})




module.exports = router;