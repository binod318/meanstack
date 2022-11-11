const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Please enter full name.'
        ]
    },
    username: {
        type: String,
        required: [
            true,
            'Please enter username'
        ]
    },
    password: String
});

mongoose.model(process.env.USER_MODEL, userSchema, process.env.USERS_COLLECTION);
