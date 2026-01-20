import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
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

// ✅ Attach WebSocket to the SAME server (NO HARD-CODED PORT)
export const wss = new WebSocketServer({ server });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port.....`);
});