const mongoose = require("mongoose");
const dotenv = require("dotenv");

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
