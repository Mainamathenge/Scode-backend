const express = require("express");
const customerController = require("../controllers/customerController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/callback", paymentController.payment);
router.post("/validate", paymentController.validation);

router
  .route("/")
  .get(customerController.getAllCustomer)
  .post(customerController.createCustomer);

router
  .route("/:id")
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
