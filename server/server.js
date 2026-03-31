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


// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const healthRoutes = require("./routes/healthRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const gameRoutes = require("./routes/gameRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const yogaRoutes = require("./routes/yogaRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const yogaAdminRoutes = require("./routes/yogaAdminRoutes");
const userRoutes = require("./routes/userRoutes");
const companionRoutes = require("./routes/companionRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const nurseRoutes = require("./routes/nurseRoutes");

// Doctor routes
app.use("/api/doctors", doctorRoutes);

// Nurse routes
app.use("/api/nurses", nurseRoutes);

// Yoga routes
app.use("/api/yoga", yogaRoutes);

//companion routes
app.use("/api/companions", companionRoutes);

// Chatbot routes
app.use("/api/chatbot", chatbotRoutes);

// Game routes
app.use("/api/games", gameRoutes);

// Medicine routes
app.use("/api/medicines", medicineRoutes);

// Health routes
app.use("/api/health", healthRoutes);

// Booking routes
app.use("/api/bookings", bookingRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin", yogaAdminRoutes); // Admin-only yoga management routes

//userRoutes
app.use("/api/users", userRoutes);

// Protected routes
app.use("/api/protected", protectedRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// ===============================
// DEFAULT / HEALTH CHECK ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Vatsal Backend Running 🚀");
});


// ===============================
// SERVER START (with Socket.io)
// ===============================
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Expose io via app locals
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
