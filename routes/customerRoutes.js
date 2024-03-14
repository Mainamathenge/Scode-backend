const express = require("express");
const customerController = require("../controllers/customerController");
const paymentController = require("../controllers/paymentController");
const userController = require("../controllers/userController");

const router = express.Router();
router.get("/search", customerController.searchCustomer);
router.post("/callback", paymentController.payment);
router.post("/validate", paymentController.validation);
router.get("/device", userController.updatedevicelocation);

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
