// const path = require('path');
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { default: helmet } = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const session = require("express-session");
// const cron = require("node-cron");
const AppError = require("./utils/appError");
// const globalErrorHandler = require('./controllers/errorController');
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/todoRoutes");
const viewController = require("./routes/viewRoutes");
const customerRouter = require("./routes/customerRoutes");
const walletRouter = require("./routes/walletRoutes");

// Start express app
const app = express();
//cron job

const startSubChecker = require("./utils/SubCheker");

const whitelist = [
  "https://scode2-0.vercel.app",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:4000",
  "*",
];
// start subscrption cheker

startSubChecker();

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests from same ip
const limiter = rateLimit({
  max: 1000000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["name", "duration", "slug"],
  })
);

//Compression middleware
app.use(compression());

// Configure session middleware
app.use(
  session({
    secret: "nsAGjIgUTDiFwaVwAoa8j9cYnUGyVgQfTClbgh6Xbipl2Noh3esss",
    resave: false,
    saveUninitialized: false,
  })
);

//Routes
app.use("/", viewController);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/wallet", walletRouter);
// dashboardRouter;

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(globalErrorHandler);

module.exports = app;
