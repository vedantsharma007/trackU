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
const allowedOrigins = [
  "http://localhost:5173",
  "https://tracku-three.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {

    // allow requests with no origin
    // (mobile apps/postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
