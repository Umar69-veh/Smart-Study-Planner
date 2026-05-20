require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chat");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/chat", chatRoutes);

// 404 & Error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Study Helper API ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
