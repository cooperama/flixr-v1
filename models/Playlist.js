const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieIdString: String,
  // Remember that this is an array and will have to be sent as one
  // even if it's one value
  movieIDs: [{
    type: String
  }]
}, {timestamps: true});

module.exports = mongoose.model('Playlist', playlistSchema);