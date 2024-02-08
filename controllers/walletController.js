const Wallet = require("../models/walletModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getWallet = factory.getOne(Wallet);
exports.getAllWallets = factory.getAll(Wallet);
exports.updateWallet = factory.updateOne(Wallet);
exports.deleteWallet = factory.deleteOne(Wallet);

exports.searchWallet = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.term;
  const customers = await Wallet.find({
    $or: [
      { TransID: { $regex: searchTerm, $options: "i" } },
      { BillRefNumber: { $regex: searchTerm, $options: "i" } },
      { InvoiceNumber: { $regex: searchTerm, $options: "i" } },
      { FirstName: { $regex: searchTerm, $options: "i" } },
    ],
  });
  res.status(200).json({
    status: "success",
    data: { customers },
  });
});
