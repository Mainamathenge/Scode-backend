// eslint-disable-next-line no-undef
const catchAsync = require("../utils/catchAsync");
const Customer = require("../models/customerModel");
const Wallet = require("../models/walletModel");
const smsSender = require("../utils/messageSender");

function updatedDeviceTime(amount, deviceTime) {
  console.log(
    "Current Time (East African Time):",
    deviceTime.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
  );
  const minutes = Math.floor(amount / 1000); // Convert milliseconds to minutes

  console.log("Minutes:", minutes);
  const newTime = new Date(deviceTime.getTime() + minutes * 60000); // Add minutes to local device time
  console.log(
    "New Time (East African Time):",
    newTime.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
  );
  return newTime;
}

exports.payment = catchAsync(async (req, res, next) => {
  const customer = await Customer.findOne({
    Device: req.body.BillRefNumber,
  }).catch((e) => {
    console.log(e);
  });
  if (customer) {
    if (customer.deviceTime < Date.now()) {
      customer.deviceTime = Date.now();
    }
    const amount = customer.loanamount - parseInt(req.body.TransAmount, 10);
    console.log("Amount before addition:", req.body.TransAmount);
    const newTime = updatedDeviceTime(
      req.body.TransAmount,
      customer.deviceTime
    );
    const updatedCustomer = await Customer.findOneAndUpdate(
      { Device: req.body.BillRefNumber },
      {
        $set: {
          loanamount: amount,
          deviceTime: newTime,
          active: true,
          reminder: true,
        },
      },
      { new: true }
    );
    const doc = await Wallet.create({
      ...req.body,
      customer: updatedCustomer._id,
    });
    // await smsSender.sendSMS(
    //   `Dear ${updatedCustomer.fullName},
    //    Your  payment of Ksh ${req.body.TransAmount} has been received.
    //     Your new balance is Ksh ${updatedCustomer.loanamount}.
    //     Thank you for your your countinued loyalty to Socode.`,
    //   updatedCustomer.phone
    // );
    // await smsSender.sendSMS(
    //   `DeviceActivation for ${amount}`,
    //   updatedCustomer.DeviceNumber
    // );
    if (doc) {
      return res.status(200).json({
        ResultCode: "0",
        ResultDesc: "Accepted",
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
