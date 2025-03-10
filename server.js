const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors({ origin: "*" })); // Allow all origins, change if needed

if (!process.env.MONGO_URI) {
  console.error("MongoDB connection string is missing!");
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// quote Schema
const DataSchema = new mongoose.Schema({
  data: String,
 
});

// userinfo Schema
const UserSchema = new mongoose.Schema({
  data: String, 
});



const DataModel = mongoose.model("Data", DataSchema);
const UserModel = mongoose.model("User", UserSchema);


// Multer Middleware for handling form-data
const upload = multer();

// API Route - POST Data (Supports JSON & Form-Data)
app.post("/submit", upload.none(), async (req, res) => {
  try {

    const newData = new DataModel(req.body);
    await newData.save();

    res.status(201).send("Data saved successfully!");
  } catch (error) {
    console.error("❌ Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API Route - POST User Data
app.post("/user", upload.none(), async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();

    res.status(201).send("User data saved successfully!");
  } catch (error) {
    console.error("❌ Error saving user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
