const mongoose = require('mongoose');
const { getEnv } = require('../utilities');

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
        select: false, //false -> hides this field in select query
        required: [
            true,
            'Please enter password!'
        ]
    }
});

mongoose.model(getEnv('USER_MODEL'), userSchema, getEnv('USERS_COLLECTION'));
