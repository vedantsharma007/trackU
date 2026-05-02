const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();


// ==================
// ✅ CORS (FIRST)
// ==================
app.use(cors({
  origin: "http://localhost:3000", // frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// handle preflight requests
app.options("*", cors());


// ==================
// 🔐 SECURITY
// ==================

// Helmet AFTER CORS
app.use(helmet());

// Rate limiter AFTER CORS
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later"
});
app.use(limiter);


// ==================
// BODY PARSER
// ==================
app.use(express.json());


// ==================
// ROUTES
// ==================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});


// ==================
// ERROR HANDLER
// ==================
app.use(errorHandler);


// ==================
// SERVER
// ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
