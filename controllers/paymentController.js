// eslint-disable-next-line no-undef
const catchAsync = require("../utils/catchAsync");
const Customer = require("../models/customerModel");
const Wallet = require("../models/walletModel");

exports.payment = catchAsync(async (req, res, next) => {
  const doc = await Wallet.create(req.body);
  if (!doc) {
    return res.status(404).json({
      ResultCode: "C2B00012",
      ResultDesc: "Rejected",
    });
  }
  res.status(200).json({
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
});

exports.validation = catchAsync(async (req, res, next) => {
  const device = req.body.BillRefNumber;
  const customer = await Customer.findOne({ Device: device });
  if (!customer) {
    return res.status(404).json({
      ResultCode: "C2B00012",
      ResultDesc: "Rejected",
    });
  }
  res.status(200).json({
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
});
