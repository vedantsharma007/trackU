const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");

// 🔐 NEW IMPORTS
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();

// 🔐 SECURITY MIDDLEWARE

// 1. Helmet → secure HTTP headers
app.use(helmet());

// 2. Rate limiting → prevent spam/abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 100 requests per IP
  message: "Too many requests, try again later"
});
app.use(limiter);

// Body parser
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
