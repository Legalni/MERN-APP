const express = require("express");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/main", isAuth, adminController.getAdminInformations);

router.post("/logout", isAuth, (req, res, next) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ message: "Uspesno ste se izlogovali" });
});

module.exports = router;
