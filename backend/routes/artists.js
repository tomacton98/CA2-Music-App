/**
 * @Date:   2020-02-17T16:33:40+00:00
 * @Last modified time: 2020-02-17T19:37:16+00:00
 */
const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

let Artist = require('../models/Artist');

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
 Artist.find()
  .then(artists => res.json(artists))
  .catch(err => res.status(400).json('Error: ' + err));
 // res.json({message: "Hi!"})

 // res.json({message: "You are trying to see a list of artists"});
});

router.route("/:id").get((req, res) => {
 const artistId = req.params.id;

 Artist.findById(artistId)
  .then(result => {
     if (!result) {
       return res.setMaxListeners(404).json({
         message: "Artist not found with id " + artistId
       });
     }
     res.json(result);
   })
   .catch(err => {
     if (err.kind === 'ObjectId') {
       return res.status(404).json({
         message: "Artist not found with id " + artistId
       });
     }
     return res.status(500).json({
       message: "Error retrieving artist with id " + artistId
     });
   });
});


router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
 const token = getToken(req.headers);
 const artist = req.body;
 if (token) {

   if (!artist.name) {
     return res.status(400).json({
       message: "Artist name can not be empty!"
     });
   }

   const newArtist = new Artist(artist);

   newArtist.save()
     .then(data => {
       res.json(data);
     })
     .catch(err => res.status(400).json('Error: ' + err));
 } else {
   return res.status(403).json({ success: false, message: 'Unauthorized' });
 }
});

router.route("/:id").put((req, res) => {
 const artistId = req.params.id;
 const newArtist = req.body;

 if (!newArtist.name) {
   return res.status(400).json({
     message: "Artist name cant be empty"
   });
 }

 Artist.findByIdAndUpdate(artistId, newArtist, { new: true })
   .then(artist => {
     if (!artist) {
       return res.status(404).json({
         message: "Artist not found with id " + artistId
       });
     }
     res.json(artist);
   }).catch(err => {
     if (err.kind === 'ObjectId') {
       return res.status(404).json({
         message: "Artist not found with Id" + artistId
       });
     }
     return res.status(500).json({
       message: "Error updating artist with id " + artistId
     });
   });
 // res.json(data);

});

router.route("/:id").delete((req, res) => {
 const artistId = req.params.id;

 Artist.findByIdAndRemove(artistId)
   .then(artist => {
     if (!artist) {
       return res.status(404).json({
         message: "Artist not found with id " + artistId
       });
     }
     res.json({ message: "Artist deleted successfully!" });
   }).catch(err => {
     if (err.kind === 'ObjectId' || err.name === 'NotFound') {
       return res.status(404).json({
         message: "Artist not found with id " + artistId
       });
     }
     return res.status(500).send({
       message: "Could not delete artist with id " + artistId
     });
   });

 // res.json(data);
});


module.exports = router;
