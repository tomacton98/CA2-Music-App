/**
 * @Date:   2020-02-17T07:32:24+00:00
 * @Last modified time: 2020-02-17T19:52:55+00:00
 */
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const artistsRouter = require('./routes/artists');
const albumsRouter = require('./routes/albums');
// const songsRouter = require('./routes/songs');
const authRouter = require('./routes/auth');
const app = express();

app.use(body_parser.json());
app.use(cors());

const uri = process.env.ATLAS_URI;
// Mongo cluster password: a6aQ7MffFPB0nAob
console.log(uri);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
  res.json({ message: "You are in the root route" });
});
app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);
// app.use('/songs', songsRouter);
app.use('/account', authRouter);

const port = 4000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
