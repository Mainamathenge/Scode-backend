const mongoose = require("mongoose");
const dotenv = require("dotenv");
const  net = require("net");

process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  // eslint-disable-next-line no-console
  console.log(err.name, err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

// Connection to a mongodb
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  // eslint-disable-next-line no-console
  .then(() => console.log("DB connection successful!"));

const tcpPort = process.env.TCP_PORT || 8000;
const tcpServer = net.createServer((socket) => {
  // Handle incoming TCP connections
  socket.on("data", (data) => {
    // Process incoming data from TCP client
    console.log("Received TCP data:", data.toString());

    // Here you can add your logic to handle TCP requests
    // For example, you can parse the data and perform actions accordingly

    // Send response back to TCP client if necessary
    socket.write("TCP response");
  });

  socket.on("end", () => {
    console.log("TCP client disconnected");
  });

  socket.on("error", (err) => {
    console.error("TCP socket error:", err);
  });
});

tcpServer.listen(tcpPort, () => {
  console.log(`TCP Server running on port ${tcpPort}`);
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on ${port}...`);
});

process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("💥 Process terminated!");
  });
});
