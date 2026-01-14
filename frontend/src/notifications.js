// src/notifications.js
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

import axios from "axios";

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    // 🔥 SEND TOKEN TO BACKEND
    await axios.post("/api/notifications/save-token", {
      token,
      platform: "web",
    });
  }
};

