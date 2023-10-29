// eslint-disable-next-line no-undef
const catchAsync = require("../utils/catchAsync");

exports.payment = catchAsync(async (req, res, next) => {
  console.log(req.body);

  res.status(200).json({
    status: "success",
  });
});

exports.validation = catchAsync(async (req, res, next) => {
  console.log(req.body);

  res.status(200).json({
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
});
