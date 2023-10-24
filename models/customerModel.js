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
  deposit: {
    type: Number,
    required: [true, "Please provide Customer balance"],
  },
  loanamount: {
    type: Number,
    required: [true, "Please provide Customer balance"],
  },
  Devices: [],
  location: {
    type: String,
    default: "Kenya",
  },
  devicelocation: {
    lat: { type: String },
    long: { type: String },
  },
  photo: {
    type: String,
    default:
      "https://asili-prod-user-uploads.s3.eu-west-1.amazonaws.com/email/user-avatar.png",
  },
  identitycard: {
    type: String,
    default:
      "https://asili-prod-user-uploads.s3.eu-west-1.amazonaws.com/email/user-avatar.png",
  },
  contract: {
    type: String,
    default:
      "https://asili-prod-user-uploads.s3.eu-west-1.amazonaws.com/email/user-avatar.png",
  },
  loanStatus: {
    type: String,
    default: "pending",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const customer = mongoose.model("User", customerSchema);

module.exports = customer;
