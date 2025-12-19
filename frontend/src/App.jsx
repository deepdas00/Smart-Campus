import { Routes, Route } from "react-router-dom";
import HomePage from "./Page/HomePage";
import SignupPage from "./Page/SignupPage"; // create this
import Profile from "./Page/Profile";
import LoginPage from "./Page/LoginPage";
import Canteen from "./Page/Canteen";
import Library from "./Page/Library";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/canteen" element={<Canteen />} />
      <Route path="/library" element={<Library />} />
    </Routes>
  );
}
