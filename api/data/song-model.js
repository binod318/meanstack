const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [
            true,
            'Please enter a song title'
        ]
    },
    rank: Number,
    year: Number,
    album: String
});

module.exports = songSchema;
//mongoose.model(process.env.SONG_MODEL, songSchema, process.env.SONGS_COLLECTION);
