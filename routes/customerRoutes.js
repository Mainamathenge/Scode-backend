const express = require("express");
const customerController = require("../controllers/customerController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/callback", paymentController.payment);

router
  .route("/")
  .get(customerController.getCustomer)
  .post(customerController.createCustomer);

router
  .route("/:id")
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
