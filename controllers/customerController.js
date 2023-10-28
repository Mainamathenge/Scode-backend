const customer = require("../models/customerModel");
const factory = require("./handlerFactory");

exports.createCustomer = factory.createOne(customer);
exports.getCustomer = factory.getOne(customer);
exports.getAllCustomer = factory.getAll(customer);
exports.updateCustomer = factory.updateOne(customer);
exports.deleteCustomer = factory.deleteOne(customer);
