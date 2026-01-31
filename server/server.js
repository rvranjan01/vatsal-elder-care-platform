// ===============================
// IMPORTS
// ===============================
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ===============================
// APP INITIALIZATION
// ===============================
const app = express();

// ===============================
// DATABASE CONNECTION
// ===============================
const connectDB = require("./config/db");
connectDB();

// ===============================
// MIDDLEWARES
// ===============================

// Enable CORS (frontend → backend communication)
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Parse URL-encoded data (forms, etc.)
app.use(express.urlencoded({ extended: true }));

// 👉 ADD MORE GLOBAL MIDDLEWARES BELOW
// app.use(morgan("dev"));
// app.use(cookieParser());

// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");

// Auth routes
app.use("/api/auth", authRoutes);

// 👉 ADD MORE ROUTE FILES BELOW
// app.use("/api/users", userRoutes);
// app.use("/api/elder", elderRoutes);
// app.use("/api/games", gameRoutes);

// ===============================
// DEFAULT / HEALTH CHECK ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Vatsal Backend Running 🚀");
});

// ===============================
// ERROR HANDLING (ADD LATER)
// ===============================
// app.use(notFound);
// app.use(errorHandler);

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
