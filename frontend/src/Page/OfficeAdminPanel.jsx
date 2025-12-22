// layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function OfficeAdminPanel() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar /> {/* This stays fixed */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet /> {/* This is where the different pages (Canteen, Library, etc.) load */}
        </div>
      </main>
    </div>
  );
}