const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: [
            true,
            'Please enter username!'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [
            true,
            'Please enter password!'
        ]
    }
});

mongoose.model(process.env.USER_MODEL, userSchema, process.env.USERS_COLLECTION);
