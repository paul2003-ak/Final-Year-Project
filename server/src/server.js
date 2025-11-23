import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();


// 🌍 Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8080;

// 🔥 Create server
const server = http.createServer(app);

// ⚡️ Setup Socket.io (for real-time tracking)
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("🟢 New user connected:", socket.id);

  socket.on("location-update", (data) => {
    // Broadcast updated location to all clients
    io.emit("update-location", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
