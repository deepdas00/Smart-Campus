import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./smart-campus-dd715-firebase-adminsdk-fbsvc-94e749dc0f.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
