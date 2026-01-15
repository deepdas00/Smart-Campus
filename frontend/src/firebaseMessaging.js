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

  new Notification(title,{
    body,

    // Large image (shows when expanded)
    image: "/logo.png",

    // Site / app icon (foreground only)
    icon: "/logo.png",

    badge: "/logo.png",

    // Improves UX
    silent: false,
    requireInteraction: false,
  });

  // 🔗 Handle click
  notification.onclick = () => {
    window.focus();
    window.location.href = "/queue/live";
    notification.close();
  };
});




