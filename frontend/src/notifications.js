// src/notifications.js
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      console.log("FCM Token:", token);

      // TODO: send token to backend
      // await axios.post("/api/save-fcm-token", { token });
    }
  } catch (err) {
    console.error("Notification permission error", err);
  }
};
