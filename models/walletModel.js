const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  TransID: {
    type: String,
  },
  TransAmount: {
    type: String,
  },
  BillRefNumber: {
    type: String,
  },
  InvoiceNumber: {
    type: String,
  },
  MSISDN: {
    type: String,
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
});

const customer = mongoose.model("Wallet", walletSchema);

module.exports = customer;
