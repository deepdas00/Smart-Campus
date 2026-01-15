import { getMessaging, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";   // your firebase initialization file
import logo from "./assets/logo.png"


// 🔔 Listen for incoming messages when site is OPEN
onMessage(messaging, (payload) => {
  console.log("(frontend/src/firebaseMessaging.js)Notification received:", payload);

  if (Notification.permission === "granted") {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: logo
    });
  }
});
