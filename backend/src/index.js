import dotenv from "dotenv";
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
// .then(() => {
//   console.log("🚀 Master DB connection successful");

//   // 3️⃣ Start server ONLY after DB is ready
//   const PORT = process.env.PORT || 8000;

//   app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
//   });
// })
// .catch((error) => {
//   console.error("❌ Failed to connect Master DB", error);
//   process.exit(1);
// });



const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port.....`);
});