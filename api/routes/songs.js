const express = require('express');
const songController = require('../controllers/songController');
const authenticationController = require('../controllers/authenticationController');
const router = express.Router();

//routes for sub document - song
router.route("/:artistId/songs")
   .get(songController.getAll)
   .post(authenticationController.authenticate, songController.addOne);

router.route("/:artistId/songs/:songId")
   .get(songController.getOne)
   .put(authenticationController.authenticate, songController.fullUpdate)
   .patch(authenticationController.authenticate, songController.partialUpdate)
   .delete(authenticationController.authenticate, songController.deleteOne);

module.exports = router;