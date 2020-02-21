/**
 * @Date:   2020-02-17T07:32:30+00:00
 * @Last modified time: 2020-02-17T18:18:33+00:00
 */



const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  name: String
});

const SongSchema = new mongoose.Schema({
  name:{
   type: String
  },
  album:{
    type: mongoose.Schema.Types.ObjectId, ref: 'Album'
  },
  genre:{
    type: [GenreSchema]
  },
  length:{
    type: String
  }
});

const Song = mongoose.model('Song', SongSchema);

module.exports = Song;
