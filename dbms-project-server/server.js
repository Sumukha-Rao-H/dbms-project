const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./db"); // Sequelize connection and model initialization
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", userRoutes); // You can add more route files here

app.get("/test", (req, res) => {
  res.send("Welcome to the Chat API!");
});

sequelize
  .sync({ force: false }) // Set to true for development to reset the database
  .then(() => {
    console.log("✅ Database connected and models synced!");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
