import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { connectMasterDB } from "./db/db.index.js";
import { app } from "./app.js";

// 1️⃣ Load environment variables
dotenv.config({
  path: "./.env",
});

import { config_cloudinary } from "./utils/cloudinary.js";
config_cloudinary()



// 2️⃣ Connect MASTER database first
connectMasterDB()


const PORT = process.env.PORT;

// ✅ Create HTTP server from Express app
const server = http.createServer(app);



// 🔥 SOCKET.IO SETUP
export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
},
});





io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("joinRoom", ({ collegeCode, role }) => {
    if (!collegeCode || !role) return;

    const room = `${collegeCode}:${role}`;
    socket.join(room);

    console.log(`🏫 Joined room → ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});




// ✅ Attach WebSocket to the SAME server (NO HARD-CODED PORT)

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port.....`);
// });




server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});