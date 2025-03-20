const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const eventRoutes = require("./Routes/eventRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const donateRoute = require("./Routes/donateRoute");
const signupRoutes = require("./Routes/signupRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Allow frontend origin
app.use(express.json()); // Parse JSON bodies

// Serve static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/services", serviceRoutes);
app.use("/contact", require("./contactus")); // Ensure contactus.js exists
app.use("/api/events", eventRoutes);
app.use("/api", donateRoute);
app.use("/api/signup", signupRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mern-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Define PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});