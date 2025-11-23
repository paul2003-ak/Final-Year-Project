import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();



const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV;


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

// server.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

const startServer=async()=>{
    try {
      await connectDB();

        //listen for local development only
        if(NODE_ENV!= "production"){
            app.listen(PORT,()=>{
                console.log(`Server is running on ${PORT}`);
            });
        }
    } catch (error) {
        console.log("Error in starting server:",error);
        // Don't exit in production, let Vercel handle it
        if(NODE_ENV !== "production") {
            process.exit(1);
        }
    }
}

// Only start server if not in production (Vercel handles this)
if(NODE_ENV !== "production") {
    startServer();
}
