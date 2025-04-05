const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize } = require("./db"); // Sequelize connection and model initialization
const userRoutes = require("./routes/userRoutes"); // Example route file

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", userRoutes); // You can add more route files here

app.get("/test", (req, res) => {
  res.send("Welcome to the Chat API!");
});

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database connected and models synced!");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });
