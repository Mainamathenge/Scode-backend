const express = require("express");
const walletController = require("../controllers/walletController");

const router = express.Router();

router.route("/").get(walletController.getAllWallets);

router
  .route("/:id")
  .get(walletController.getWallet)
  .patch(walletController.updateWallet)
  .delete(walletController.deleteWallet);

module.exports = router;
