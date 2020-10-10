const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
}, {timestamps: true});


module.exports = mongoose.model('Playlist', playlistSchema);