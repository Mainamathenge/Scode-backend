const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please tell us your fullName!"],
  },
  phone: {
    type: Number,
    required: [true, " please provide a valid customer number"],
  },
  idnumber: {
    type: Number,
    required: [true, " please provide the customers id number"],
  },
  deposit: {
    type: Number,
    required: [true, "Please provide Customer balance"],
  },
  loanamount: {
    type: Number,
    required: [true, "Please provide Customer balance"],
  },
  Device: {
    type: String,
    required: [true, "Please provide a valid device id "],
  },
  location: {
    type: String,
    default: "Kenya",
  },
  devicelocation: {
    lat: { type: String, default: "Kenya" },
    long: { type: String, default: "Kenya" },
  },
  photo: {
    type: String,
    default: "photoString",
  },
  identitycard: {
    type: String,
    default: "idlink",
  },
  contract: {
    type: String,
    default: "",
  },
  loanStatus: {
    type: String,
    default: "pending",
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const customer = mongoose.model("Customer", customerSchema);

module.exports = customer;
