const customer = require("../models/customerModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.createCustomer = factory.createOne(customer);
exports.getCustomer = factory.getOne(customer);
exports.getAllCustomer = factory.getAll(customer);
exports.updateCustomer = factory.updateOne(customer);
exports.deleteCustomer = factory.deleteOne(customer);

exports.getActiveCustomers = catchAsync(async () => {
  const customers = await customer.find({ active: true });
  console.log(customers);
  return customers;
});
