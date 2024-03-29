const mongoose = require("mongoose");

const updateDeviceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  linkId: {
    type: String,
  },
  text: {
    type: String,
  },
  id: {
    type: String,
  },
  from: {
    type: String,
  },
  networkCode: {
    type: String,
  },
  cost: {
    type: String,
  },
  date: {
    type: String,
  },
});

const UpdateDevice = mongoose.model("updateDevice", updateDeviceSchema);

module.exports = UpdateDevice;
