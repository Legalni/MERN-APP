const express = require("express");

const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/main", isAuth, userController.getUserInformations);

module.exports = router;
