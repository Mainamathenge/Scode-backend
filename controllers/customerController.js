const net = require("net");
const Customer = require("../models/customerModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const { Socket } = require("dgram");

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
  console.log("update device", req.body);
  res.status(200).json({
    status: "success",
    data: { message: "Device updated" },
  });
});
