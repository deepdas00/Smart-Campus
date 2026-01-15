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
 if (!/Mobi|Android/i.test(navigator.userAgent)) {
   new Notification(title, {
     body,
     icon: `/logo.png`,
     badge: `/logo.png`
    });
  }

  showInAppToast(title, body);

});

// onMessage(messaging, (payload) => {
//   const title = payload.data?.title || "Smart Campus";
//   const body = payload.data?.body || "New update";

//   // Desktop: system notification
//   if (!/Mobi|Android/i.test(navigator.userAgent)) {
//     new Notification(title, { body, icon: "/logo.png" });
//   }

//   // Mobile: in-app banner / toast
//   showInAppToast(title, body);
// });

function showInAppToast(title, body) {
  const toast = document.createElement("div");
  toast.innerHTML = `<b>${title}</b><br>${body}`;
  toast.style = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #111;
    color: white;
    padding: 12px 18px;
    border-radius: 8px;
    z-index: 9999;
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

