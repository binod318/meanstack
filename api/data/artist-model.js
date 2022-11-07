const mongoose = require('mongoose');
const songSchema = require('./song-model');

const artistSchema = mongoose.Schema({
    artistName: {
        type: String,
        required: [
            true,
            'Please enter a name for the artist',
        ]
    },
    bornYear: {
        type: Number,
        required: [
            true,
            'Please enter a year for the artist\'s born'
        ]
    },
    diedYear: Number,
    nation: String,
    gender: String,
    bands: [String],
    firstSong: String,
    songs: [songSchema]
});

mongoose.model(process.env.ARTIST_MODEL, artistSchema, process.env.ARTISTS_COLLECTION);