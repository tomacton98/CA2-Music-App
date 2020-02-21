/**
 * @Date:   2020-02-17T07:32:28+00:00
 * @Last modified time: 2020-02-17T19:47:20+00:00
 */



const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: {
   type: String,
   required: true
 },
  biography: {
   type: String,
   required: true
},
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
