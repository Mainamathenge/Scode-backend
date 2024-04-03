const express = require("express");
const customerController = require("../controllers/customerController");
const paymentController = require("../controllers/paymentController");
const userController = require("../controllers/userController");

const router = express.Router();
router.get("/search", customerController.searchCustomer);
router.post("/payment", paymentController.payment);
router.post("/validate", paymentController.validation);
router.get("/device", userController.updatedevicelocation);
router.post("/update-device", customerController.updateDevice);
router.get("/sendSms", customerController.smsSenderTest);

router.patch("/activateCustomer/:id", customerController.activateCustomer);

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
