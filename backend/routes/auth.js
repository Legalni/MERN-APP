const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isLoggedIn = require("../middleware/is-logged-in");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Upisite odgovarajuci email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Ovaj email se vec koristi");
        }
      })
      .normalizeEmail(),
    body("username").trim().not().isEmpty(),
    body("password").trim().isLength({ min: 5 }),
    body("confirmedPassword").trim().isLength({ min: 5 }),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").trim().isEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.login
);

router.post(
  "/admin-login",
  [
    body("email").trim().isEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.adminLogin
);

router.put(
  "/change-data",
  [
    body("email").trim().isEmail(),
    body("oldPassword").trim().isLength({ min: 5 }),
    body("password").trim().isLength({ min: 5 }),
    body("confirmedPassword").trim().isLength({ min: 5 }),
  ],
  authController.changeData
);

router.post("/checkAuth", isLoggedIn, authController.checkAuth);

module.exports = router;
