const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

router.get("/main", isAuth, userController.getUserInformations);

module.exports = router;
