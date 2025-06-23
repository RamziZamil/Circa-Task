const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/game", gameRoutes);
app.get("/", (req, res) => {
  res.send("Dev Mind Speed Game API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
