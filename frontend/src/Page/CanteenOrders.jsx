import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Package,
  Receipt,
  CreditCard,
  Calendar,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Navbar from "../Components/Navbar/Navbar";
import ProfileSidebar from "../Components/ProfileSidebar";
// import CollegeInfo from "../Components/CollegeInfo";
import Footer from "../Components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

export default function CanteenOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const normalizeOrderStatus = (status) => {
    return status === "served" ? "served" : "pending";
  };

  const ORDER_STATUS_CONFIG = {
    pending: {
      label: "Pending",
      bar: "bg-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-100",
    },
    served: {
      label: "Served",
      bar: "bg-green-500",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = Cookies.get("accessToken");
        const res = await axios.get(
          `${API_URL}/api/v1/canteen/orders/my-history`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const filteredOrders = res.data.data.filter((order) => {
          if (activeFilter === "all") return true;
          return normalizeOrderStatus(order.orderStatus) === activeFilter;
        });

        setOrders(filteredOrders);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return normalizeOrderStatus(order.orderStatus) === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <Navbar />
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/* Top Banner Section */}
      <div className="bg-white border-b border-slate-100 pb-12">
        {/* <CollegeInfo /> */}
        <div className="max-w-6xl mx-auto px-6 sm:mt-8 mt-1">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Order <span className="text-orange-500">History</span>
              </h1>
              <p className="text-slate-500 font-medium sm:mt-2 text-xs sm:text-lg">
                Track your canteen cravings and expenses
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="flex w-full gap-2 sm:gap-4">
              {/* ===== TOTAL SPENT ===== */}
              <div
                className="
    flex-1 md:flex-none
    bg-orange-50
    p-3 sm:p-5
    rounded-xl sm:rounded-3xl
    border border-orange-100
    flex items-center gap-3 sm:gap-4
  "
              >
                {/* Icon */}
                <div
                  className="
      w-10 h-10 sm:w-12 sm:h-12
      bg-white rounded-xl sm:rounded-2xl
      shadow-sm
      flex items-center justify-center
      text-orange-600
      shrink-0
    "
                >
                  <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-xs font-bold text-orange-400 uppercase">
                    Total Spent
                  </p>
                  <p className="text-base sm:text-2xl font-black text-slate-900 truncate">
                    ₹{totalSpent}
                  </p>
                </div>
              </div>

              {/* ===== ORDERS ===== */}
              <div
                className="
    flex-1 md:flex-none
    bg-blue-50
    p-3 sm:p-5
    rounded-xl sm:rounded-3xl
    border border-blue-100
    flex items-center gap-3 sm:gap-4
  "
              >
                {/* Icon */}
                <div
                  className="
      w-10 h-10 sm:w-12 sm:h-12
      bg-white rounded-xl sm:rounded-2xl
      shadow-sm
      flex items-center justify-center
      text-blue-600
      shrink-0
    "
                >
                  <Package className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-xs font-bold text-blue-400 uppercase">
                    Orders
                  </p>
                  <p className="text-base sm:text-2xl font-black text-slate-900">
                    {orders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main List */}
          <div className="lg:col-span-8 space-y-4">
            {loading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-32 w-full bg-slate-100 animate-pulse rounded-3xl"
                  />
                ))
              : orders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="
    group bg-white border border-slate-200
    rounded-2xl sm:rounded-[2rem]
    sm:p-2 sm:p-2
    hover:shadow-2xl hover:shadow-slate-200/50
    transition-all duration-500
    relative overflow-hidden
  "
                  >
                    {/* Status Indicator Bar */}
                    <div
                      className={`
      absolute left-0
      top-4 bottom-4 sm:top-8 sm:bottom-8
      w-1 sm:w-1.5 rounded-r-full
      ${order.orderStatus === "served" ? "bg-green-500" : "bg-orange-500"}
    `}
                    />

                    <div
                      className="
    p-3 sm:p-4
    flex flex-col md:flex-row
    items-start md:items-center
    justify-between
    gap-4 sm:gap-6
  "
                    >
                      {/* LEFT: INFO */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div
                          className="
         p-1 sm:h-16 sm:w-16
        bg-slate-50 rounded-xl sm:rounded-[1.5rem]
        flex items-center justify-center
        text-slate-400
        group-hover:bg-orange-500 group-hover:text-white
        transition-all duration-300
        shrink-0
      "
                        >
                          <Receipt className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                            #
                            {order.transactionCode ||
                              "ORD-" + order._id.slice(-5)}
                            <span
                                            className={`
                            text-[8px] sm:text-[10px]
                            px-2 py-0.5 rounded-md border
                            font-bold uppercase tracking-tighter
                            ${
                              order.orderStatus === "served"
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }
                          `}
                            >
                              {order.orderStatus}
                            </span>
                          </h3>

                          <p className="text-[10px] sm:text-sm text-slate-400 font-medium mt-1">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            •{" "}
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* MIDDLE: ITEMS */}
                      <div
                        className="
      flex flex-wrap gap-2
      w-full md:flex-1
      justify-start md:justify-center
    "
                      >
                        {order.items.slice(0, 2).map((item, i) => (
                          <span
                            key={i}
                            className="
            px-2.5 sm:py-1
            bg-slate-50 rounded-lg sm:rounded-xl
            text-[10px] sm:text-xs
            font-semibold text-slate-600
            border border-slate-100
          "
                          >
                            {item.name}
                            <span className="text-orange-500 ml-1">
                              x{item.quantity}
                            </span>
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[11px] sm:text-xs font-bold text-slate-400 flex items-center">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* RIGHT: PRICE + ACTION */}
                      <div
                        className="
      w-full md:w-auto
      flex items-center
      justify-between md:justify-end
      gap-4 sm:gap-6
      border-t md:border-t-0
      pt-1 sm:pt-3 md:pt-0
    "
                      >
                        <div className="text-left md:text-right">
                          <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Amount
                          </p>
                          <p className="text-sm sm:text-2xl font-black text-slate-900">
                            ₹{order.totalAmount}
                          </p>
                        </div>

                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="
          p-1 sm:h-12 sm:w-12
          rounded-xl sm:rounded-2xl
          bg-slate-900 text-white
          flex items-center justify-center
          hover:bg-orange-500 transition-colors
          shadow-lg shadow-slate-200
          shrink-0
        "
                        >
                          <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Right Sidebar: Filters & Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[1rem] sm:rounded-[2.5rem] p-3 sm:p-8 text-white relative overflow-hidden">
              <div className="relative">
                <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                <p className="text-slate-400 text-[10px] sm:text-sm mb-6">
                  If you have issues with a specific order, please contact the
                  canteen manager.
                </p>
                <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold transition-all shadow-xl shadow-orange-900/20 text-sm">
                  Contact Support
                </button>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Receipt-Style Modal */}
          <div className="relative bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 rounded-[2.5rem] flex flex-col max-h-[98vh]">
            {/* 1. FIXED TOP: Decorative Bar & Header */}
            <div
              className={`h-2 w-[90%] mx-auto rounded-t-full flex items-center justify-center shrink-0 ${
                selectedOrder.orderStatus === "served"
                  ? "bg-green-500"
                  : "bg-orange-500"
              }`}
            />

            <div
              className={
                selectedOrder.orderStatus === "order_received"
                  ? "text-center shrink-0"
                  : "pt-8 px-8 pb-4 text-center shrink-0"
              }
            >
              <div className="inline-flex items-center justify-center w-45 h-45 bg-slate-50 rounded-full mb-3 border border-slate-100 shadow-inner">
                {selectedOrder.orderStatus === "order_received" ? (
                  <img
                    src={selectedOrder.qrCode} // QR image URL / base64
                    alt="Order QR Code"
                    className="w-45 h-45 object-contain"
                  />
                ) : (
                  <Package className="text-slate-900" size={120} />
                )}
              </div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-1">
                Transaction Summary
              </h2>
              <p className="text-xl font-black text-slate-900">
                #
                {selectedOrder.transactionCode ||
                  selectedOrder._id.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* 2. SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto px-8 py-2 overflow-x-hidden custom-scrollbar">
              {/* Status Pills */}
              <div className="flex justify-center gap-2 mb-6">
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                    selectedOrder.paymentStatus === "paid"
                      ? "bg-emerald-500 text-white border-emerald-400"
                      : "bg-amber-500 text-white border-amber-400"
                  }`}
                >
                  {selectedOrder.paymentStatus}
                </span>
                <span className="px-4 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest border border-slate-800 shadow-sm">
                  {selectedOrder.orderStatus?.replace("_", " ")}
                </span>
              </div>

              {/* Item Table */}
              <div className="space-y-4 overflow-x-hidden ">
                <p className="text-[10px] font-black   text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 sticky top-0 bg-white z-10">
                  Items Ordered
                </p>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center group animate-in slide-in-from-bottom-2 duration-300 overflow-x-hidden "
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        Qty: {item.quantity} @ ₹
                        {item.price ||
                          (selectedOrder.totalAmount / item.quantity).toFixed(
                            0
                          )}
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      ₹
                      {item.quantity *
                        (item.price ||
                          (selectedOrder.totalAmount / item.quantity).toFixed(
                            0
                          ))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dotted Divider inside scroll to separate items from meta */}
              <div className="border-t-2 border-dashed border-slate-100 my-4 relative">
                <div className="absolute -left-12 -top-2 w-4 h-4 bg-slate-900/10 rounded-full" />
                <div className="absolute -right-12 -top-2 w-4 h-4 bg-slate-900/10 rounded-full" />
              </div>

              <div className="text-center pb-4">
                <p className="text-[10px] text-slate-400 font-medium">
                  Ordered on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()} at{" "}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* 3. FIXED BOTTOM: Totals & Action */}
            <div
              className={
                selectedOrder.orderStatus === "order_received"
                  ? "p-8 py-3 bg-slate-50/50 border-t border-slate-100 rounded-b-[2.5rem] shrink-0"
                  : "p-8 py-3 bg-slate-50/50 border-t border-slate-100 rounded-b-[2.5rem] shrink-0"
              }
            >
              <div
                className={
                  selectedOrder.orderStatus === "order_received"
                    ? "space-y-2 mb-2"
                    : "space-y-2 mb-6"
                }
              >
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-black text-slate-900">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-orange-600 tracking-tighter">
                    ₹{selectedOrder.totalAmount}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                Close Receipt
              </button>
            </div>

            {/* Close Cross */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all z-20"
            >
              <span className="text-xl font-light">×</span>
            </button>

            {/* Custom Scrollbar Styling */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
