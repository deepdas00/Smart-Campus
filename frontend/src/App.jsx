import { Routes, Route } from "react-router-dom";
import HomePage from "./Page/HomePage";
import SignupPage from "./Page/SignupPage"; // create this

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<SignupPage />} />
    </Routes>
  );
}
