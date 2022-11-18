const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

//routes for user
router.route("/")
   .get(userController.getAll)
   .post(userController.addUser);

router.route("/login")
   .post(userController.login);

router.route("/:userId")
   .get(userController.getOne)
   .delete(userController.deleteOne);

module.exports = router;