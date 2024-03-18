// eslint-disable-next-line no-undef
const catchAsync = require("../utils/catchAsync");
const Customer = require("../models/customerModel");
const Wallet = require("../models/walletModel");

function updatedDeviceTime(amount, curentTime) {
  const minutes = amount / 1000;
  const newTime = curentTime.setMinutes(curentTime.getMinutes() + 10);
  console.log("new Time", newTime.toLocaleString());
  return newTime;
}

exports.payment = catchAsync(async (req, res, next) => {
  const customer = await Customer.findOne({ Device: req.body.BillRefNumber });
  if (customer) {
    const amount = customer.loanamount - parseInt(req.body.TransAmount, 10);
    console.log(`old time ${customer.deviceTime}`);
    const newTime = updatedDeviceTime(amount, customer.deviceTime);

    console.log(`New time ${newTime} `);

    const updatedCustomer = await Customer.findOneAndUpdate(
      { Device: req.body.BillRefNumber },
      { $set: { loanamount: amount, deviceTime: newTime, active: true } },
      { new: true }
    );
    const doc = await Wallet.create(req.body);
    if (doc) {
      return res.status(200).json({
        ResultCode: "0",
        ResultDesc: "Accepted",
        update_customer: updatedCustomer,
        Wallet: doc,
      });
    }
  }
  return res.status(404).json({
    ResultCode: "C2B00012",
    ResultDesc: "Rejected",
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
