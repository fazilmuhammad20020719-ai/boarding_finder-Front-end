require("dotenv").config();
const express = require("express");
const cors = require("cors");
const initDb = require("./config/initDb");
const authRoutes = require("./routes/auth");
const dbViewerRoutes = require("./routes/dbViewer");
const listingsRoutes = require("./routes/listings");
const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS Configuration ─────────────────────
// Allows your frontend to communicate with this backend.
// Update CORS_ORIGIN in .env to match your domains (comma-separated, e.g., https://boarding-finder-front-end.vercel.app,http://localhost:5173)
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) 
  : ["*"];

const corsOptions = {
  origin: "*", // Temporarily allow all origins to prevent CORS errors during development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// ─── Routes ──────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "BoardingFinder API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/db", dbViewerRoutes);
app.use("/api/listings", listingsRoutes);
// ─── Start Server ────────────────────────────
const startServer = async () => {
  try {
    // Initialize database tables
    await initDb();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || "*"}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();