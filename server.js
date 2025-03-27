const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const eventRoutes = require("./Routes/eventRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const donateRoute = require("./Routes/donateRoute");
const signupRoutes = require("./Routes/signupRoutes");
const userRoutes = require('./Routes/userRoutes');
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true 
}));
app.use(express.json());

// Serve static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/services", serviceRoutes);
app.use("/contact", require("./contactus"));
app.use("/api/events", eventRoutes);
app.use("/api", donateRoute);
app.use("/api/signup", signupRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', dbState: mongoose.connection.readyState });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
  })
  .then(() => {
    console.log("MongoDB Connected to database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Improved error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Define PORT
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});