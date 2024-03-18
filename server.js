const mongoose = require("mongoose");
const dotenv = require("dotenv");
const net = require("net");

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
  .then(() => console.log("DB connection successful!"));

// Connection to a tcp server
const tcpServer = net.createServer((socket) => {
  const response = {
    message: "Hello, device! You are now connected to the server.",
  };
  socket.write(JSON.stringify(response));
  socket.on("data", (data) => {
    try {
      const jsonData = JSON.parse(data.toString());
      console.log("Received data over TCP:", jsonData);
    } catch (error) {
      console.error("Error processing TCP data:", error);
    }
  });
});

// Start HTTP server
const TCP_PORT = process.env.TCP_PORT || 3001; // Define the port for TCP server
tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server is listening on port ${TCP_PORT}`);
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
