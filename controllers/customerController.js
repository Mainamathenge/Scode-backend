// Description: This file contains the logic to handle the requests from the routes related to the customer.
const Customer = require("../models/customerModel");
const UpdateDevice = require("../models/updateDeviceModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const smsSender = require("../utils/messageSender");

exports.createCustomer = factory.createOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.getAllCustomer = factory.getAll(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);

exports.getActiveCustomers = catchAsync(async () => {
  const customers = await Customer.find({ active: true });
  // console.log(Customer);
  return customers;
});

exports.smsSenderTest = catchAsync(async (req, res, next) => {
  const Sender = await smsSender.sendSMS("Hello", "+254748829383");
  console.log(Sender);
  res.status(200).json({
    status: "success",
    data: Sender,
  });
});

exports.searchCustomer = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.term;
  const customers = await Customer.find({
    $or: [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { Device: { $regex: searchTerm, $options: "i" } },
      { devicelocation: { $regex: searchTerm, $options: "i" } },
    ],
  });
  res.status(200).json({
    status: "success",
    data: { customers },
  });
});

exports.updateDevice = catchAsync(async (req, res, next) => {
  const message = req.body;
  const customer = await Customer.findOne({ DeviceNumber: message.from });
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: "Customer not found",
    });
  }
  const update = await UpdateDevice.create({
    customer: customer._id,
    linkId: message.linkId,
    text: message.text,
    id: message.id,
    from: message.from,
    networkCode: message.networkCode,
    cost: message.cost,
    date: message.date,
  });
  console.log("customer", update);
  res.status(200).json({
    status: "success",
    data: req.body,
  });
});

exports.activateCustomer = catchAsync(async (req, res, next) => {
  const customer = req.params.id;
  const deviceTime = new Date();
  const newTime = new Date(deviceTime.getTime() + 10 * 60000);
  const customerToActivate = await Customer.findById(customer);
  if (!customerToActivate) {
    return res.status(404).json({
      status: "fail",
      message: "Customer not found",
    });
  }
  customerToActivate.active = true;
  customerToActivate.deviceTime = newTime;
  customerToActivate.reminder = true;
  const ActivateCustomer = await customerToActivate.save();
  await smsSender.sendSMS(
    `Dear ${ActivateCustomer.fullName},

    Great news! Your device has been successfully activated.  You can now start using it.
    
    To keep your device active, please top up your account using
    Mpesa Paybill number 123456 with account number ${ActivateCustomer.Device}.
    
    We're happy to have you on board!`,
    ActivateCustomer.phone
  );
  await smsSender.sendSMS(
    `Activation for ${ActivateCustomer.Device}`,
    ActivateCustomer.DeviceNumber
  );
  res.status(200).json({
    status: "success",
    data: ActivateCustomer,
  });
});
