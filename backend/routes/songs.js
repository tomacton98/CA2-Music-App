const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);
let Song = require('../models/Song');

const getToken = (headers) => {
if (headers && headers.authorization) {
  var parted = headers.authorization.split(' ');
  if (parted.length === 2) {
    return parted[1];
  } else {
    return null;
  }
} else {
  return null;
}
};

// GET ALL

router.route('/').get((req, res) => {
Song.find()
.populate(['albums', 'artists'])
.exec()
    .then(songs => res.json(songs))
    .catch(err => res.status(400).json('Error: ' + err));

// res.json({message: "You are trying to see a list of songs"});
});

router.route("/:id").get((req, res) => {
const songId = req.params.id;

Song.findById(songId)
.populate(['albums', 'artists'])
.exec()
  .then(result => {
    if (!result) {
      return res.setMaxListeners(404).json({
        message: "Song not found with id " + songId
      });
    }
    res.json(result);
  })
  .catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: "Song not found with id " + songId
      });
    }
    return res.status(500).json({
      message: "Error retrieving song with id " + songId
    });
  });
});


router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
const token = getToken(req.headers);
const song = req.body;
if (token) {

  if (!song.name) {
    return res.status(400).json({
      message: "Song name can not be empty!"
    });
  }

  const newSong = new Song(song);

  newSong.save()
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Error: ' + err));
} else {
  return res.status(403).json({ success: false, message: 'Unauthorized' });
}
});

router.route("/:id").put((req, res) => {
const songId = req.params.id;
const newSong = req.body;

if (!newSong.name) {
  return res.status(400).json({
    message: "Song name cant be empty"
  });
}

Song.findByIdAndUpdate(songId, newSong, { new: true })
  .then(song => {
    if (!song) {
      return res.status(404).json({
        message: "Song not found with id " + songId
      });
    }
    res.json(song);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        message: "Song not found with Id" + songId
      });
    }
    return res.status(500).json({
      message: "Error updating song with id " + songId
    });
  });
// res.json(data);

});

router.route("/:id").delete((req, res) => {
const songId = req.params.id;

Song.findByIdAndRemove(songId)
  .then(song => {
    if (!song) {
      return res.status(404).json({
        message: "Song not found with id " + songId
      });
    }
    res.json({ message: "Song deleted successfully!" });
  }).catch(err => {
    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).json({
        message: "Song not found with id " + songId
      });
    }
    return res.status(500).send({
      message: "Could not delete song with id " + songId
    });
  });

// res.json(data);
});


module.exports = router;
