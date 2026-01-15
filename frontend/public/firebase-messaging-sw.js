// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "AIzaSyAdxwpFacUGK4XE62RRcskddBxqpTbpn0Y",
//   authDomain: "smart-campus-dd715.firebaseapp.com",
//   projectId: "smart-campus-dd715",
//   storageBucket: "smart-campus-dd715.firebasestorage.app",
//   messagingSenderId: "1077022868092",
//   appId: "1:1077022868092:web:38ee7d71e52d6443d6bff9",
// });

// const messaging = firebase.messaging();

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);


firebase.initializeApp({
  apiKey: "AIzaSyAdxwpFacUGK4XE62RRcskddBxqpTbpn0Y",
  authDomain: "smart-campus-dd715.firebaseapp.com",
  projectId: "smart-campus-dd715",
  storageBucket: "smart-campus-dd715.firebasestorage.app",
  messagingSenderId: "1077022868092",
  appId: "1:1077022868092:web:38ee7d71e52d6443d6bff9",
});

const messaging = firebase.messaging();

// 🟢 THIS is the important part
self.addEventListener("push", function (event) {
  const payload = event.data.json();

  console.log("📩 PUSH RECEIVED:", payload);

  const title = payload.data?.title || "Smart Campus";

  const options = {
    body: payload.data?.body || "New update",

    // 🔴 REQUIRED small icon (status bar)
    icon: "/notification-icon.png",

    // 🟢 Large image (expanded view)
    image: "/logo.png",

    badge: "/badge.png",

    // 🔔 Engagement boosters
    vibrate: [100, 50, 100],
    tag: "smart-campus",
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: "open", title: "📍 View Queue" },
      { action: "dismiss", title: "❌ Dismiss" }
    ],

    data: {
      url: "/queue/live"
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});