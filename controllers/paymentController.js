// eslint-disable-next-line no-undef
const catchAsync = require("../utils/catchAsync");
const Customer = require("../models/customerModel");

exports.payment = catchAsync(async (req, res, next) => {
  console.log(req.body);

  res.status(200).json({
    status: "success",
  });
});

exports.validation = catchAsync(async (req, res, next) => {
  const device = req.body.BillRefNumber;
  const customer = await Customer.findOne({ Device: device });
  const loanamount = customer.loanamount - req.body.amount;
  customer.loanamount = loanamount;
  await customer.save();

  res.status(200).json({
    loanamount: loanamount,
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
});
