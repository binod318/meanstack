const express = require('express');
const artistController = require('../controllers/artistController');
const songController = require('../controllers/songController');
const userController = require('../controllers/userController');
const router = express.Router();

//routs for main document - artist
router.route("/artists")
   .get(artistController.getAll)
   .post(artistController.addOne);

router.route("/artists/:artistId")
   .get(artistController.getOne)
   .put(artistController.fullUpdate)
   .patch(artistController.partialUpdate)
   .delete(artistController.deleteOne);

//routes for sub document - song
router.route("/artists/:artistId/songs")
   .get(songController.getAll)
   .post(songController.addOne);

router.route("/artists/:artistId/songs/:songId")
   .get(songController.getOne)
   .put(songController.fullUpdate)
   .patch(songController.partialUpdate)
   .delete(songController.deleteOne);

//routes for user
router.route("/users")
   .get(userController.getAll)
   .post(userController.addUser);

module.exports = router;