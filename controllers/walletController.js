const Wallet = require("../models/walletModel");
const factory = require("./handlerFactory");

exports.getWallet = factory.getOne(Wallet);
exports.getAllWallets = factory.getAll(Wallet);
exports.updateWallet = factory.updateOne(Wallet);
exports.deleteWallet = factory.deleteOne(Wallet);
