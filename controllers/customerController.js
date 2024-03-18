const net = require("net");
const Customer = require("../models/customerModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const { Socket } = require("dgram");

exports.createCustomer = factory.createOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.getAllCustomer = factory.getAll(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);

exports.getActiveCustomers = catchAsync(async () => {
  const customers = await Customer.find({ active: true });
  // console.log(Customer);
  return customers;
});

exports.searchCustomer = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.term;
  const customers = await Customer.find({
    $or: [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { Device: { $regex: searchTerm, $options: "i" } },
      { devicelocation: { $regex: searchTerm, $options: "i" } },
    ],
  });
  res.status(200).json({
    status: "success",
    data: { customers },
  });
});

exports.updateDevice = catchAsync(async (req, res, next) => {
  const TCP_PORT = process.env.TCP_PORT || 3001;
  const results = req.query;
  const tcpClient = net.connect({ port: TCP_PORT }, () => {
    console.log("Connected to TCP server");
    const data = {
      Device: "angle1",
      devicelocation: "angel2",
      status: true,
    };
    tcpClient.end();
    res.json({
      message: "Data sent to TCP server successfully",
      respose: results,
    });
    // tcpClient.write(JSON.stringify(data));
    // tcpClient.write(JSON.stringify(data));
  });
  tcpClient.on("data", (response) => {
    // eslint-disable-next-line no-console
    console.log("Received response from TCP server:", response.toString());
    tcpClient.end();
  });

  // Handle errors (if any)
  tcpClient.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("TCP client error:", err);
    res.status(500).json({ error: "Failed to send data to TCP server" });
  });
});
