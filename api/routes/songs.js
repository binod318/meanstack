const express = require('express');
const songController = require('../controllers/songController');
const router = express.Router();

//routes for sub document - song
router.route("/:artistId/songs")
   .get(songController.getAll)
   .post(songController.addOne);

router.route("/:artistId/songs/:songId")
   .get(songController.getOne)
   .put(songController.fullUpdate)
   .patch(songController.partialUpdate)
   .delete(songController.deleteOne);

module.exports = router;