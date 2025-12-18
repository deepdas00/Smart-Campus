import { Routes, Route } from "react-router-dom";
import HomePage from "./Page/HomePage";
import SignupPage from "./Page/SignupPage"; // create this
import Profile from "./Page/Profile";
import LoginPage from "./Page/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
