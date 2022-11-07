const express = require('express');
const artistController = require('../controllers/artistController');
const songController = require('../controllers/songController');
const router = express.Router();

//routs for main document - artist
router.route("/artists")
   .get(artistController.getAll)
   .post(artistController.addOne);

router.route("/artists/:artistId")
   .get(artistController.getOne)
   .put(artistController.updateOne)
   .patch(artistController.partialUpdateOne)
   .delete(artistController.deleteOne);

//routes for sub document - song
router.route("/artists/:artistId/songs")
   .get(songController.getAll)
   .post(songController.create);

router.route("/artists/:artistId/songs/:songId")
   .get(songController.getOne)
   .put(songController.update)
   .patch(songController.partialUpdate)
   .delete(songController.remove);

module.exports = router;