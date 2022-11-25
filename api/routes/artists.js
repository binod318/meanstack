const express = require('express');
const artistController = require('../controllers/artistController');
const authenticationController = require('../controllers/authenticationController');
const router = express.Router();

//routs for main document - artist
router.route("/")
   .get(artistController.getAll)
   .post(authenticationController.authenticate, artistController.addOne);

router.route("/totalcount")
   .get(artistController.getTotalCount);

router.route("/:artistId")
   .get(authenticationController.authenticate, artistController.getOne)
   .put(authenticationController.authenticate, artistController.fullUpdate)
   .patch(authenticationController.authenticate, artistController.partialUpdate)
   .delete(authenticationController.authenticate, artistController.deleteOne);

module.exports = router;