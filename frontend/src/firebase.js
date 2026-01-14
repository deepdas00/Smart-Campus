// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAdxwpFacUGK4XE62RRcskddBxqpTbpn0Y",
  authDomain: "smart-campus-dd715.firebaseapp.com",
  projectId: "smart-campus-dd715",
  storageBucket: "smart-campus-dd715.firebasestorage.app",
  messagingSenderId: "1077022868092",
  appId: "1:1077022868092:web:38ee7d71e52d6443d6bff9",
  measurementId: "G-5E1CLGB647"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
