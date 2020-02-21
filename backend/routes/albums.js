/**
 * @Date:   2020-02-17T16:33:40+00:00
 * @Last modified time: 2020-02-17T17:58:06+00:00
 */
 const router = require('express').Router();
 const passport = require('passport');
 const settings = require('../config/passport')(passport);
 let Album = require('../models/Album');

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

 router.route('/').get((req, res) => {
   Album.find()
    .populate(['artist'])
    .exec()
     .then(albums => res.json(albums))
     .catch(err => res.status(400).json('Error: ' + err));

   // res.json({message: "You are trying to see a list of albums"});
 });

 router.route("/:id").get((req, res) => {
   const albumId = req.params.id;

   Album.findById(albumId)
   .populate(['artist'])
   .exec()
     .then(result => {
       if (!result) {
         return res.setMaxListeners(404).json({
           message: "Album not found with id " + albumId
         });
       }
       res.json(result);
     })
     .catch(err => {
       if (err.kind === 'ObjectId') {
         return res.status(404).json({
           message: "Album not found with id " + albumId
         });
       }
       return res.status(500).json({
         message: "Error retrieving album with id " + albumId
       });
     });
 });


 router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
   const token = getToken(req.headers);
   const album = req.body;
   if (token) {

     if (!album.name) {
       return res.status(400).json({
         message: "Album title can not be empty!"
       });
     }

     const newAlbum = new Album(album);

     newAlbum.save()
       .then(data => {
         res.json(data);
       })
       .catch(err => res.status(400).json('Error: ' + err));
   } else {
     return res.status(403).json({ success: false, message: 'Unauthorized' });
   }
 });

 router.route("/:id").put((req, res) => {
   const albumId = req.params.id;
   const newAlbum = req.body;

   if (!newAlbum.name) {
     return res.status(400).json({
       message: "Album name cant be empty"
     });
   }

   Album.findByIdAndUpdate(albumId, newAlbum, { new: true })
     .then(album => {
       if (!album) {
         return res.status(404).json({
           message: "Album not found with id " + albumId
         });
       }
       res.json(album);
     }).catch(err => {
       if (err.kind === 'ObjectId') {
         return res.status(404).json({
           message: "Album not found with Id" + albumId
         });
       }
       return res.status(500).json({
         message: "Error updating album with id " + albumId
       });
     });
   // res.json(data);

 });

 router.route("/:id").delete((req, res) => {
   const albumId = req.params.id;

   Album.findByIdAndRemove(albumId)
     .then(album => {
       if (!album) {
         return res.status(404).json({
           message: "Album not found with id " + albumId
         });
       }
       res.json({ message: "Album deleted successfully!" });
     }).catch(err => {
       if (err.kind === 'ObjectId' || err.name === 'NotFound') {
         return res.status(404).json({
           message: "Album not found with id " + albumId
         });
       }
       return res.status(500).send({
         message: "Could not delete album with id " + albumId
       });
     });

   // res.json(data);
 });


 module.exports = router;
