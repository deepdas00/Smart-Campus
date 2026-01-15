// import fs from "fs";
// import admin from "firebase-admin";

import dotenv from "dotenv";

// 1️⃣ Load environment variables
dotenv.config({
  path: "./.env",
});
// let serviceAccount;

// if (process.env.FIREBASE_SERVICE_ACCOUNT) {
//   serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// } else {
//   serviceAccount = JSON.parse(
//     fs.readFileSync("./smart-campus-dd715-firebase-adminsdk.json", "utf8")
//   );
// }


// serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8"));

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// export default admin;


import admin from "firebase-admin";

const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;

if (!b64) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_B64 in environment variables");
}

const serviceAccount = JSON.parse(
  Buffer.from(b64, "base64").toString("utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
