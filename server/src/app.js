import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorhandling.js";

dotenv.config();

const app = express();

// 🔧 Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin:" http://localhost:5173",
  credentials: true,
}));
app.use(morgan("dev"));

import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import ai from './routes/gemini.js'

app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/ai", ai);



// 🧱 Error Handling
app.use(errorHandler);

export default app;
