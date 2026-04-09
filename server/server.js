// // ===============================
// // IMPORTS
// // ===============================
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// // ===============================
// // APP INITIALIZATION
// // ===============================
// const app = express();

// // ===============================
// // DATABASE CONNECTION
// // ===============================
// const connectDB = require("./config/db");
// connectDB();

// // ===============================
// // AUTO-SEED ADMIN ON STARTUP
// // ===============================
// const seedAdmin = require("./scripts/seedAdmin");

// const startSeeding = async () => {
//   try {
//     await seedAdmin();
//     console.log("Admin seeding completed (or admin already exists)");
//   } catch (error) {
//     console.error("Seeding error (non-fatal):", error.message);
//   }
// };

// startSeeding();

// // ===============================
// // MIDDLEWARES
// // ===============================

// // Enable CORS (frontend → backend communication)
// app.use(
//   cors({
//     origin: [
//       "https://vatsal-mu.vercel.app",
//       "http://localhost:3000",
//       "http://localhost:5000",
//     ],
//     credentials: true,
//   }),
// );

// // Parse incoming JSON data
// app.use(express.json());

// // Parse URL-encoded data (forms, etc.)
// app.use(express.urlencoded({ extended: true }));

// // ===============================
// // ROUTES
// // ===============================
// const authRoutes = require("./routes/authRoutes");
// const protectedRoutes = require("./routes/protectedRoutes");
// const healthRoutes = require("./routes/healthRoutes");
// const medicineRoutes = require("./routes/medicineRoutes");
// const gameRoutes = require("./routes/gameRoutes");
// // const chatbotRoutes = require("./routes/chatbotRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const yogaRoutes = require("./routes/yogaRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const yogaAdminRoutes = require("./routes/yogaAdminRoutes");
// const userRoutes = require("./routes/userRoutes");
// const companionRoutes = require("./routes/companionRoutes");
// const doctorRoutes = require("./routes/doctorRoutes");
// const nurseRoutes = require("./routes/nurseRoutes");
// const localEventRoutes = require("./routes/localEvents");
// const publicEventRoutes = require("./routes/publicEvents");
// const familyRoutes = require("./routes/familyRoutes");

// // Public routes
// app.use("/api", publicEventRoutes);

// // Local Events routes
// app.use("/api/admin", localEventRoutes);

// // Doctor routes
// app.use("/api/doctors", doctorRoutes);

// // Nurse routes
// app.use("/api/nurses", nurseRoutes);

// // Yoga routes
// app.use("/api/yoga", yogaRoutes);

// //companion routes
// app.use("/api/companions", companionRoutes);

// // Chatbot routes
// // app.use("/api/chatbot", chatbotRoutes);
// app.use("/api/chat", chatRoutes);

// // Game routes
// app.use("/api/games", gameRoutes);

// // Medicine routes
// app.use("/api/medicines", medicineRoutes);

// // Health routes
// app.use("/api/health", healthRoutes);

// // Booking routes
// app.use("/api/bookings", bookingRoutes);

// // Admin routes
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin", yogaAdminRoutes); // Admin-only yoga management routes

// //userRoutes
// app.use("/api/users", userRoutes);

// //family routes
// app.use("/api/family", familyRoutes);

// // Protected routes
// app.use("/api/protected", protectedRoutes);

// // Auth routes
// app.use("/api/auth", authRoutes);

// // ===============================
// // DEFAULT / HEALTH CHECK ROUTE
// // ===============================
// app.get("/", (req, res) => {
//   res.send("Vatsal Backend Running 🚀");
// });

// // ===============================
// // SERVER START (with Socket.io)
// // ===============================
// const http = require("http");
// const server = http.createServer(app);

// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "https://vatsal-mu.vercel.app",
//       "http://localhost:3000",
//       "http://localhost:5000",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   },
// });

// // Expose io via app locals
// app.set("io", io);

// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);
//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// ===============================
// IMPORTS
// ===============================
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// ===============================
// APP INITIALIZATION
// ===============================
const app = express();
const server = http.createServer(app);

// ===============================
// DATABASE CONNECTION
// ===============================
const connectDB = require("./config/db");
connectDB();

// ===============================
// AUTO-SEED ADMIN ON STARTUP
// ===============================
const seedAdmin = require("./scripts/seedAdmin");

const startSeeding = async () => {
  try {
    await seedAdmin();
    console.log("Admin seeding completed (or admin already exists)");
  } catch (error) {
    console.error("Seeding error (non-fatal):", error.message);
  }
};

startSeeding();

// ===============================
// CORS CONFIGURATION
// ===============================
const allowedOrigins = [
  "https://vatsal-mu.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed from this origin: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// SOCKET.IO
// ===============================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const healthRoutes = require("./routes/healthRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const gameRoutes = require("./routes/gameRoutes");
// const chatbotRoutes = require("./routes/chatbotRoutes");
const chatRoutes = require("./routes/chatRoutes");
const yogaRoutes = require("./routes/yogaRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const yogaAdminRoutes = require("./routes/yogaAdminRoutes");
const userRoutes = require("./routes/userRoutes");
const companionRoutes = require("./routes/companionRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const localEventRoutes = require("./routes/localEvents");
const publicEventRoutes = require("./routes/publicEvents");
const familyRoutes = require("./routes/familyRoutes");

// Public routes
app.use("/api", publicEventRoutes);

// Local Events routes
app.use("/api/admin", localEventRoutes);

// Doctor routes
app.use("/api/doctors", doctorRoutes);

// Nurse routes
app.use("/api/nurses", nurseRoutes);

// Yoga routes
app.use("/api/yoga", yogaRoutes);

// Companion routes
app.use("/api/companions", companionRoutes);

// Chat routes
app.use("/api/chat", chatRoutes);

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
app.use("/api/admin", yogaAdminRoutes);

// User routes
app.use("/api/users", userRoutes);

// Family routes
app.use("/api/family", familyRoutes);

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
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});