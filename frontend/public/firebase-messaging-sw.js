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

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

import logo from "../src/assets/logo.png"


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

  const title = payload.notification?.title || "Smart Campus";
  const options = {
    body: payload.notification?.body || "",
    icon: logo,
    badge: logo
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
