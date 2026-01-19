import "./firebaseMessaging";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { requestPermission } from "./notifications.js";
import { CollegeProvider } from "./context/CollegeContext.jsx";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CollegeProvider>
        <App />
        </CollegeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
