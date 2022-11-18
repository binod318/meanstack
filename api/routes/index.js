const express = require('express');
const artistsRoute = require('./artists');
const songsRoute = require('./songs');
const usersRoute = require('./users');
const router = express.Router();

router.use('/artists', artistsRoute);
router.use('/artists', songsRoute);
router.use('/users', usersRoute);

module.exports = router;