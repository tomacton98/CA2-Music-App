/**
 * @Date:   2020-02-17T07:32:28+00:00
 * @Last modified time: 2020-02-17T17:24:42+00:00
 */



const mongoose = require('mongoose');

const SongsSchema = new mongoose.Schema({
  name: String
});

const AlbumSchema = new mongoose.Schema({
  name:{
   type: String
  },
  songs: {
    type: [SongsSchema],
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },

  length:{
    type: String
  },
  year:{
    type: String
  }
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
