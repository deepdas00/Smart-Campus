import React from "react";
import { useState, useEffect } from "react";
import {
  X,
  User,
  ShoppingBag,
  Utensils,
  ChevronRight,
  Book,
  BookSearchIcon,
  BookDashed,
  BookDashedIcon,
  BookTemplate,
  ShieldAlert,
  LogIn,
  LogOut 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfileSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState(user?.studentName);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [rollNo, setRollNo] = useState(user?.rollNo);
  const [shortName, setShortName] = useState("");

  useEffect(() => {
    if (user?.studentName) {
      const words = user.studentName.trim().split(" "); // split by space
      if (words.length === 1) {
        setShortName(words[0]); // only one word
      } else {
        setShortName(words[0][0] + words[1][0]); // first letters of first + second word
      }
    }
  }, [user]);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...", { id: "logout" });

      await axios.post(
        `${API_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );

      logout(); // clear context
      toast.success("Logged out successfully", { id: "logout" });

      onClose();
      setTimeout(() => navigate("/login"), 100);
    } catch (error) {
      console.error(error);
      toast.error("Logout failed", { id: "logout" });
    }
  };

  function LogoutItem({ icon, label, onLogout }) {
    return (
      <button
        onClick={onLogout}
        className="w-full group flex items-center justify-between px-4 py-3 rounded-lg transition hover:bg-red-50 text-red-600"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white shadow-sm rounded-md">{icon}</div>
          <span className="font-medium">{label}</span>
        </div>

        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-105 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`z-900 fixed right-0 top-0 h-full w-80 bg-white z-110 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-4 mt-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.studentName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-xl font-bold">
                  {shortName.toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{studentName} Dashboard</h3>
              <p className="text-sm text-blue-100">{rollNo}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-4 space-y-2">
          <SidebarItem
            to="/profile"
            icon={<User className="w-5 h-5" />}
            label="Profile"
            color="blue"
            onClose={onClose}
          />

          <SidebarItem
            to="/orders"
            icon={<ShoppingBag className="w-5 h-5" />}
            label="My Orders"
            color="orange"
            onClose={onClose}
          />

          <SidebarItem
            to="/canteen"
            icon={<Utensils className="w-5 h-5" />}
            label="Canteen"
            color="green"
            onClose={onClose}
          />

          <SidebarItem
            to="/library"
            icon={<Book className="w-5 h-5" />}
            label="library"
            color="blue"
            onClose={onClose}
          />
          <SidebarItem
            to="/report"
            icon={<ShieldAlert className="w-5 h-5" />}
            label="report"
            color="#ff0000"
            activeColor="bg-red-50 text-red-600"
            onClose={onClose}
          />
          {user ? (
            <LogoutItem
              icon={<LogIn className="w-5 h-5" />}
              label="Logout"
              onLogout={handleLogout}
            />
          ) : (
            <SidebarItem
              to="/login"
              icon={<LogIn className="w-5 h-5" />}
              label="logout"
              color="blue"
              onClose={onClose}
            />
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t text-xs text-gray-500 text-center">
          © 2025 Smart Campus
        </div>
      </div>
    </>
  );
}

/* 🔹 Reusable Menu Item */
function SidebarItem({ to, icon, label, color, onClose }) {
  const colors = {
    blue: "hover:bg-blue-50 text-blue-600",
    orange: "hover:bg-orange-50 text-orange-600",
    green: "hover:bg-green-50 text-green-600",
  };

  return (
    <Link
      to={to}
      onClick={onClose}
      className={`group flex items-center justify-between px-4 py-3 rounded-lg transition ${colors[color]}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white shadow-sm rounded-md">{icon}</div>
        <span className="font-medium text-gray-800">{label}</span>
      </div>

      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-gray-400" />
    </Link>
  );
}
