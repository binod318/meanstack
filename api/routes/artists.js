const express = require('express');
const artistController = require('../controllers/artistController');
const router = express.Router();

//routs for main document - artist
router.route("/")
   .get(artistController.getAll)
   .post(artistController.addOne);

router.route("/totalcount")
   .get(artistController.getTotalCount);

router.route("/:artistId")
   .get(artistController.getOne)
   .put(artistController.fullUpdate)
   .patch(artistController.partialUpdate)
   .delete(artistController.deleteOne);

module.exports = router;