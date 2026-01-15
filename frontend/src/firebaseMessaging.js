import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

// 🔔 Request permission once (important for mobile)
export const requestNotificationPermission = async () => {
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

// 🔔 Foreground notifications
onMessage(messaging, (payload) => {
  console.log("Notification received:", payload);

  if (Notification.permission !== "granted") return;

  const title = payload.data?.title || "Smart Campus";
  const body = payload.data?.body || "New update";

  new Notification(title, {
    body,
    icon: `/logo.png`,
    badge: `/badge.png`,
   
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = "/queue/live";
    notification.close();
  };

  
});


