import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoutes from "./route/user.route.js"; 


const app = express();
app.use(cors());
app.use(express.json()),
dotenv.config();

const PORT = process.env.PORT || 5000;
const MongoDBURI = process.env.MongoDBURI;

console.log("🔍 MongoDBURI from .env:", MongoDBURI);

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(MongoDBURI);
    console.log("✅ Connected to mongoDB");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
};

connectDB();

// Middleware
app.use(express.json()); // only once!

// Routes
app.get("/", (req, res) => {
  res.send("Mern");
});

app.use("/book", bookRoute);
app.use("/user", userRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
