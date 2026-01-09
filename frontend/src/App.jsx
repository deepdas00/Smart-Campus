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

import  CampusIssues  from "./Page/CampusIssues";
import { CanteenManager } from "./Page/CanteenManager";
import { LibraryManager } from "./Page/LibraryManager";
import Navbar from "./Components/Navbar/Navbar";
import { LostAndFoundManager } from "./Page/LostAndFoundManager";
import { StudentManager } from "./Page/StudentManager";
import { KitchenKDS } from "./Page/KitchenKDS";
import Footer from "./Components/Footer";
import LibraryTeacherHandle from "./Page/LibraryTeacherHandle";
import ReportPortal from "./Page/ReportPortal";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
// import CollegeInfo from "./Components/CollegeInfo.jsx";
import HomeLogin from "./Page/HomeLogin.jsx";
import CollegeHome from "./Page/CollegeHome.jsx";
import Sidebar from "./components/Sidebar.jsx";
import AdminOwner from "./Page/AdminOwner.jsx";
import FounderConsole from "./Page/FounderConsole.jsx";
import ForgotPassword from "./Page/ForgotPassword.jsx";
import ReportHistory from "./Page/ReportHistory.jsx";
import { CollegePolicy } from "./Page/CollegePolicy";

import OfficeOverview from "./Page/OfficeOverview.jsx";
import Teacher from "./Page/Teacher.jsx";
import CollegeDept from "./Page/CollegeDept.jsx";
import ChangePassword from "./Page/ChangePassword.jsx";
// import { Toaster } from "react-hot-toast";

// Layout Wrapper
const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Top Navbar */}
      <Navbar />
      {/* <CollegeInfo /> */}

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* Pages render here */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default function App() {
  const { user } = useAuth();

  const userRole = user?.role;
  console.log("USER ROLE HAI...", userRole);
  console.log("ENVIRONMENT...", import.meta.env.VITE_API_URL);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allow={["student"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allow={["student"]}>
              <CanteenOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute allow={["student"]}>
              <ReportPortal />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-history"
          element={
            <ProtectedRoute allow={["student"]}>
              <ReportHistory />{" "}
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute allow={["student", "librarian", "admin"]}>
              <HomeLogin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute allow={["student", "librarian", "admin"]}>
              <Library />
            </ProtectedRoute>
          }
        />

        <Route
          path="/canteen"
          element={
            <ProtectedRoute allow={["student", "canteen", "admin"]}>
              <Canteen />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OfficeOverview />} />
          <Route path="issues" element={<CampusIssues />} />
          <Route path="canteen" element={<CanteenManager />} />
          <Route path="library" element={<LibraryManager />} />
          <Route path="lost-found" element={<LostAndFoundManager />} />
          <Route path="students" element={<StudentManager />} />
          <Route path="college-info" element={<CollegeHome />} />
          <Route path="college-policy" element={<CollegePolicy />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="department" element={<CollegeDept />} />

        </Route>

        {/* Librarian Routes */}
        <Route
          path="/library-admin"
          element={
            <ProtectedRoute allow={["librarian", "admin"]}>
              <LibraryTeacherHandle />
            </ProtectedRoute>
          }
        />

        {/* Canteen Operational Routes */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allow={["canteen", "admin"]}>
              <KitchenKDS />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<HomePage />} />






        {/* <Route path="/collegeHome" element={<CollegeHome />} /> */}
        <Route path="/adminowner" element={<AdminOwner />} />
        <Route path="/founderConsole" element={<FounderConsole />} />
        
        {/* Kitchen Access - Operational Tool Only */}
      </Routes>
    </>
  );
}
