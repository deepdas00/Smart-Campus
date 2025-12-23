import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./Page/HomePage";
import SignupPage from "./Page/SignupPage"; // create this
import Profile from "./Page/Profile";
import LoginPage from "./Page/LoginPage";
import Canteen from "./Page/Canteen";
import Library from "./Page/Library";
import CanteenOrders from "./Page/CanteenOrders";
import OfficeAdminPanel from "./Page/OfficeAdminPanel";
import Sidebar from "./Components/Sidebar.jsx";
import { OfficeOverview } from "./Components/OfficeOverview";
import { CampusIssues } from "./Page/CampusIssues";
import { CanteenManager } from "./Page/CanteenManager";
import { LibraryManager } from "./Page/LibraryManager";
import Navbar from "./Components/Navbar/Navbar";
import { LostAndFoundManager } from "./Page/LostAndFoundManager";
import { StudentManager } from "./Page/StudentManager";
import { KitchenKDS } from "./Page/KitchenKDS";
import Footer from "./Components/Footer";
import LibraryTeacherHandle from "./Page/LibraryTeacherHandle";
import ReportPortal from "./Page/ReportPortal";

// Layout Wrapper
const AdminLayout = () => (
  <>
  <div className="flex bg--50 min-h-screen">
    <Navbar />
    <Sidebar />
    <main className="flex-1 p-8 mt-15">
      <Outlet /> {/* This is where the pages will swap */}
    </main>

     
  </div>
{/* Footer */}
      <Footer/>
  </>
);

export default function App() {
  const userRole = "ADMIN";

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/canteen" element={<Canteen />} />
        <Route path="/library" element={<Library />} />
        <Route path="/orders" element={<CanteenOrders />} />
        <Route path="/report" element={<ReportPortal />} />
        {userRole === "ADMIN" && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OfficeOverview />} /> {/* Default Page */}
            <Route path="issues" element={<CampusIssues />} />
            <Route path="canteen" element={<CanteenManager />} />
            <Route path="library" element={<LibraryManager />} />
            <Route path="lost-found" element={<LostAndFoundManager />} />
            <Route path="students" element={<StudentManager />} />
          </Route>
        )}

        {/* Kitchen Access - Operational Tool Only */}
        {(userRole === "KITCHEN" ||userRole === "ADMIN") && (
          <Route path="/kitchen" element={<KitchenKDS />} />
        )}

        {(userRole === "LIBRARY" ||userRole === "ADMIN")&& (
  <Route path="/library-admin" element={<LibraryTeacherHandle />} />
)}
      </Routes>
    </>
  );
}
