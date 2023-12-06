const express = require("express");

const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/main", isAuth, userController.getUserInformations);

router.post("/add-transaction", isAuth, userController.postTransaction);

router.get("/transactions", isAuth, userController.getTransactions);

router.post("/logout", isAuth, (req, res, next) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ message: "Uspesno ste se izlogovali" });
});

module.exports = router;
