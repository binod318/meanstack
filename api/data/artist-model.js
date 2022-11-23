const mongoose = require('mongoose');
const songSchema = require('./song-model');
const { getEnv } = require('../utilities');

const addressSchema = mongoose.Schema({
    coordinates: [Number]
});

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
    address: addressSchema,
    songs: [songSchema]
});

mongoose.model(getEnv('ARTIST_MODEL'), artistSchema, getEnv('ARTISTS_COLLECTION'));
