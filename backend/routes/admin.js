const express = require("express");

const isAuth = require("../middleware/is-auth");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/main", isAuth, adminController.getAdminInformations);

router.get("/user/:username", isAuth, adminController.getUserInformations);

router.get("/transactions", isAuth, adminController.getTransactions);

router.post("/add-transaction", isAuth, adminController.acceptUserTransaction);

router.post(
  "/reject-request/:requestId",
  isAuth,
  adminController.rejectUserTransaction
);

router.post(
  "/delete-transaction/:transactionId",
  isAuth,
  adminController.deleteTransaction
);

router.post("/logout", isAuth, (req, res, next) => {
  return res
    .status(200)
    .clearCookie("token")
    .json({ message: "Uspesno ste se izlogovali" });
});

router.post(
  "/post-add-transaction",
  isAuth,
  adminController.addUserTransaction
);

router.post("/delete-user/:userId", isAuth, adminController.deleteUser);

module.exports = router;
