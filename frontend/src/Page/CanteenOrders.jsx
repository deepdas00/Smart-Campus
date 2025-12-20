import React from "react";
import { useState } from "react";
import { Clock, CheckCircle, Package, Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import CollegeInfo from "../Components/CollegeInfo";
import ProfileSidebar from "../Components/ProfileSidebar";
import Footer from "../Components/Footer";
const orders = [
  {
    id: "ORD123456",
    time: "10:30 AM",
    date: "22 Feb 2025",
    status: "Preparing",
    total: 180,
    items: [
      { name: "Masala Dosa", qty: 1, price: 60 },
      { name: "Idli Sambar", qty: 2, price: 40 },
    ],
  },
  {
    id: "ORD123789",
    time: "1:15 PM",
    date: "21 Feb 2025",
    status: "Completed",
    total: 120,
    items: [{ name: "Veg Thali", qty: 1, price: 120 }],
  },
];

const totalMonthly = orders.reduce((sum, order) => sum + order.total, 0);

export default function CanteenOrders() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-700 pt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Open</span>
                <span className="text-gray-400">|</span>
                <span>7 AM – 9 PM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500">
                Logout
              </span>
              <Link className="flex items-center space-x-2">
                <img
                  src={profile}
                  alt="Profile"
                  onClick={() => setShowProfileMenu(true)}
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Profile side menu bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/* College Info */}
      <CollegeInfo />

      <div className="max-w-4xl mx-auto px-3 pb-10">
        {/* Page Title */}

        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-5">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-4 animate-fadeSlide">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl animate-bounce">🍔</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                My Canteen Orders
              </h1>
              <p className="text-gray-500 mt-1">
                Track, review, and manage your recent food orders
              </p>
            </div>
          </div>

          {/* Right: Stats card */}
          {/* Right: Stats card */}
          <div className="bg-green-200 rounded-xl shadow-md px-6 py-4 flex gap-6 animate-fadeSlide">
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-gray-700">
                {orders.length}
              </span>
              <span className="text-xs text-gray-400">Orders</span>
            </div>
            <div className="flex flex-col items-center border-l border-black-200 pl-6">
              <span className="text-lg font-semibold text-gray-700">
                ₹{totalMonthly}
              </span>
              <span className="text-xs text-gray-400">This Month</span>
            </div>
          </div>

          <style>
            {`
      @keyframes fadeSlide {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeSlide {
        animation: fadeSlide 0.6s ease-out both;
      }
      .animate-bounce {
        animation: bounce 1.2s infinite alternate;
      }
      @keyframes bounce {
        0% { transform: translateY(0); }
        100% { transform: translateY(-8px); }
      }
    `}
          </style>
        </div>

        {/* Orders List */}
        <div className="space-y-8 pt-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group bg-orange-100 backdrop-blur-md border border-gray-200/60 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Order ID
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    #{order.id}
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full tracking-wide shadow-sm ${
                    order.status === "Completed"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 divide-y">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 text-sm">
                    <span className="text-gray-700 font-medium">
                      {item.name}
                      <span className="text-gray-400 ml-1">×{item.qty}</span>
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{item.qty * item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {order.time}, {order.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {order.items.length} items
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xl font-extrabold bg-green-700 bg-clip-text text-transparent">
                  <Receipt className="w-5 h-5" />₹{order.total}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-24">
            <CheckCircle className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your canteen orders will appear here
            </p>
          </div>
        )}
      </div>

      {/*page footer */}

      <Footer />
    </div>
  );
}
