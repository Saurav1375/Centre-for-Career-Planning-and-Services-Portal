import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRouter from "./routes/index.router.js";
import "./utils/cron.js"; // Initialize Cron Jobs

dotenv.config();

const port = process.env.PORT || 3000;
  
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use all API routes
app.use("/api", apiRouter);

// Start the server
app.listen(port, () => {
  // connectDB();
  console.log(`Server is running at port ${port}`);
});
