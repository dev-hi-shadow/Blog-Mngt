const path = require("path");

// Load env variables
require("dotenv").config({
  path: path.join(
    __dirname,
    `../.env.${process.env.NODE_ENV || "development"}`
  ),
});
const { sequelize } = require("./config/mysql.js");

// Express App
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Initialize Middlewares
app.use(express.json()); // parse JSON data in request body
app.use(express.urlencoded({ limit: "*", extended: true })); // parse URL-encoded data in request body

// template engine configuration
app.set("view engine", "ejs");

// all data as body parse to json format`
app.use(bodyParser.json());

// cors configurations
var cors = require("cors"); //import cors module

const allowedOrigins = [
  "*",
  "http://localhost:5173/",
  "http://localhost:5174/",
  "http://localhost:3000/",
  "http://localhost:4000/",
];

// CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Use CORS middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow specific HTTP methods
    allowedHeaders: ["Authorization", "Content-Type"], // Allow specific headers
  })
);

// morgan configurations to print api request logs
const morgan = require("morgan");
// Print api request log into terminal.
// here we are used dev format to print logs into terminal because it's print quick overview about user request with colorful output
app.use(morgan("dev"));

// Variables
const PORT = process.env.PORT;

// Default route
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `<h1>Welcome to GrowthGuru</h1><br /><a href="${process.env.LANDING_PAGE_URL}">Click Here</a> to view ShopHere Ecommerce Official Website.`
    );
});

// Deefined API Routes

app.use(require("./routes/index"));

// common middleware to handle all errors
app.use((err, req, res, next) => {
  console.log("🚀  err:", err);
  const sendErrors = {
    status: 500,
    success: false,
  };
  sendErrors.errors = Array.isArray(err.errors)
    ? err.errors.map((error) => error.message)
    : err;
  res.status(err?.statusCode || 500).json(sendErrors);
});

// Connect MySQL database
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL database connection has been established successfully.");
    // Start server to listen user request on your port
    app.listen(PORT, () => {
      console.log(
        `Server is start listing on port: ${PORT}. Visit http://localhost:${PORT}`
      );
    });
  })
  .catch((reason) =>
    console.log("Unable to connect to the MySQL database:", reason)
  );
