import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import jsQR from "jsqr";
import {
  CheckCircle2,
  Clock,
  QrCode,
  Utensils,
  AlertCircle,
  ChevronRight,
  XCircle,
  Shield,
  Printer,
  Play,
  Zap,
  LogOut,
  Flame,
  TrendingUp,
  Package,
  Plus,
  Edit3,
  Trash2,
  UploadCloud,
  CheckCircle,
  X,
  Check,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
import CollegeInfo from "../Components/CollegeInfo";

export function KitchenKDS() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0); // 0 to 100
  const isDragging = useRef(false);
  const videoRef = useRef(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [editingFood, setEditingFood] = useState(null); // null = adding, otherwise editing
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const PREVIEW_COUNT = 2; // change to 3 if you want
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [foodForm, setFoodForm] = useState({
    name: "",
    price: "",
    quantityAvailable: "",
    category: "snacks",
    foodType: "veg",
    description: "",
  });
  const [addingFood, setAddingFood] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState();
  const [startFetchedAt, setStartFetchedAt] = useState(16);
  const currentHour = new Date().getHours(); // 0–23

  const isOnline = currentHour >= lastFetchedAt && currentHour < startFetchedAt;

  const [range, setRange] = useState(1); // default daily
  const RANGE_MAP = { 1: "daily", 7: "weekly", 30: "monthly" };
  const [deleteTarget, setDeleteTarget] = useState(null); // food item to delete
  const [deleting, setDeleting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const canvasRef = useRef(null);
  const [scannedOrder, setScannedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const track = document.getElementById("swipe-track");
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(Math.max((x / rect.width) * 100, 0), 100);

    setSwipeProgress(progress);
    if (progress > 95) {
      isDragging.current = false;
      setSwipeProgress(100);
      handleServeOrder(); // Trigger the actual function
    }
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (swipeProgress < 95) setSwipeProgress(0);
  };

  useEffect(() => {
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [swipeProgress]);

  const fetchCanteenStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/canteen/canteenStatus`, {
        withCredentials: true,
      });

      setIsOpen(res.data.data);
    } catch (err) {
      console.error("Failed to fetch canteen status", err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode(); // 🚀 start scanning loop
      }
    } catch (err) {
      console.error("Camera access denied", err);
      toast.error("Camera permission required");
    }
  };

  useEffect(() => {
    if (showQRScanner && videoRef.current && canvasRef.current) {
      startCamera();
    }
  }, [showQRScanner]);

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const scan = () => {
      if (!video || video.readyState !== 4) {
        requestAnimationFrame(scan);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        stopCamera();
        handleQRResult(code.data);
      } else {
        requestAnimationFrame(scan);
      }
    };

    scan();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleQRResult = (qrData) => {
    try {
      stopCamera();
      setShowQRScanner(false);
      const parsed = JSON.parse(qrData);

      if (!parsed.orderId) {
        toast.error("Invalid QR code");
        return;
      }

      console.log("hele", parsed.orderId);

      fetchOrderDetails(parsed.orderId);
    } catch (err) {
      toast.error("Invalid QR format");
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      console.log("final", orderId);

      const res = await axios.get(
        `${API_URL}/api/v1/canteen/orders/details/${orderId}`,
        { withCredentials: true }
      );


      console.log("response", res);

      setScannedOrder(res.data.data);
      setShowConfirmModal(true);
      stopCamera();
    } catch (err) {
      toast.error("Order not found or already served");
    }
  };

  const handleServeOrder = async () => {
    try {
      setIsProcessing(true); // Start loading state
      console.log("SCANEERRRR ID ", scannedOrder._id);

      await axios.post(
        `${API_URL}/api/v1/canteen/orders/serve`,
        { orderId: scannedOrder._id },
        { withCredentials: true }
      );

      // 1. Close the Confirmation/Swipe window
      setShowConfirmModal(false);
      setSwipeProgress(0); // Reset swipe for next time

      // 2. Open the Success Window
      setShowSuccessModal(true);
      toast.success("Order served successfully");

      // 3. Optional: Auto-close success window after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setScannedOrder(null);
      }, 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to serve order"
      );
      setSwipeProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchCanteenStatus();
  }, []);

  const toggleOnlineStatus = async () => {
    if (toggleLoading) return;

    const nextStatus = !isOpen;
    console.log("hiiii");

    try {
      setToggleLoading(true);

      // 1️⃣ Optimistic UI (instant transition)
      setIsOpen(nextStatus);

      // 2️⃣ Backend update
      try {
        console.log("1️⃣ BEFORE API");

        const res = await axios.post(
          `${API_URL}/api/v1/canteen/isActive`,
          { isActive: nextStatus },
          { withCredentials: true }
        );

        console.log("2️⃣ AFTER API", res.data.data);
      } catch (err) {
        console.error("❌ ERROR:", err?.response || err.message);
      } finally {
        console.log("3️⃣ FINALLY");
      }

      console.log("heeloooooooooooooo");

      toast.success(
        nextStatus ? "Canteen is now OPEN" : "Canteen is now CLOSED"
      );
    } catch (err) {
      // 3️⃣ Rollback if API fails
      setIsOpen((prev) => !prev);
      toast.error("Failed to update canteen status");
    } finally {
      setToggleLoading(false);
    }
  };

  const deleteFood = async (foodId) => {
    try {
      console.log("Deleting food", foodId);

      const res = await axios.delete(
        `${API_URL}/api/v1/canteen/food/${foodId}`,
        {
          withCredentials: true, // sends cookies automatically
        }
      );

      console.log("Delete response:", res.data);
      toast.success("Food deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err.response || err);
      toast.error("Failed to delete food.");
    }
  };

  const confirmDeleteFood = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteFood(deleteTarget._id);

      setMenuItems((prev) =>
        prev.filter((item) => item._id !== deleteTarget._id)
      );

      toast.success("Food item deleted");
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete food");
    } finally {
      setDeleting(false);
    }
  };

  // Real-time clock for the HUD

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/v1/canteen/foods`,
          { withCredentials: true } // if auth cookies are used
        );

        console.log("agayaaa food", res.data.data);

        setMenuItems(res.data?.data?.foods); // adjust if response structure differs
      } catch (err) {
        setError("Failed to load food menu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const toggleAvailability = async (item) => {
    try {
      console.log("Toggling item:", item._id);

      const res = await axios.patch(
        `${API_URL}/api/v1/canteen/foods/${item._id}`, // <-- 'foods' plural
        { isAvailable: !item.isAvailable },
        { withCredentials: true }
      );

      console.log("Updated in DB:", res.data);

      // Update UI
      setMenuItems(
        menuItems.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m
        )
      );
    } catch (err) {
      console.error("Failed to update availability:", err);
      toast.error("Could not update availability. Try again.");

      // Revert UI
      setMenuItems(
        menuItems.map((m) =>
          m._id === item._id ? { ...m, isAvailable: item.isAvailable } : m
        )
      );
    }
  };

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  const handleAddOrEditFood = async () => {
    if (
      !foodForm.name ||
      !foodForm.price ||
      !foodForm.category ||
      !foodForm.foodType
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setAddingFood(true);

      const formData = new FormData();
      formData.append("name", foodForm.name);
      formData.append("price", Number(foodForm.price));
      formData.append("quantityAvailable", Number(foodForm.quantityAvailable));
      formData.append("category", foodForm.category);
      formData.append("foodType", foodForm.foodType);
      formData.append("description", foodForm.description || "");
      if (foodForm.image) formData.append("image", foodForm.image);

      let res;
      if (editingFood) {
        // Edit existing
        res = await axios.patch(
          `${API_URL}/api/v1/canteen/foods/${editingFood._id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update menuItems locally
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingFood._id ? res.data.data : item
          )
        );
        toast.success("Food updated successfully!");
      } else {
        // Add new
        res = await axios.post(`${API_URL}/api/v1/canteen/foods`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMenuItems([...menuItems, res.data.data]);
        toast.success("Food added successfully!");
      }

      setShowAddFood(false);
      setEditingFood(null);
      setFoodForm({
        name: "",
        price: "",
        quantityAvailable: "",
        category: "snacks",
        foodType: "veg",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save food.");
    } finally {
      setAddingFood(false);
    }
  };

  useEffect(() => {
    const fetchDashboardOrders = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/v1/canteen/orders/dashboard?range=${RANGE_MAP[range]}`,
          { withCredentials: true }
        );

        console.log("Dashboard API response:", res.data);

        const rawOrders =
          res.data?.orders || res.data?.data?.orders || res.data?.data || [];

        if (!Array.isArray(rawOrders)) {
          console.error("Orders is not array:", rawOrders);
          setOrders([]);
          return;
        }

        console.log("RAWWWWWWWWW", rawOrders);

        const formattedOrders = rawOrders.map((o) => ({
          id: o.transactionCode,
          student: o.studentId.studentName || "Student",
          rollNo: o.studentId.rollNo || "---",
          items: Array.isArray(o.items)
            ? o.items.map((i) => `${i.foodName || i.name} x${i.quantity || 1}`)
            : [],
          total: o.totalAmount || 0,
          waitTime: Math.max(
            1,
            Math.floor((Date.now() - new Date(o.createdAt)) / 60000)
          ),
          // "order_received",
          //       "preparing",
          //       "ready",
          //       "served",
          status: o.orderStatus === "order_received" ? "preparing" : "ready",
          paymentStatus: o.paymentStatus,
        }));

        console.log("order aya", formattedOrders);
        setOrders(formattedOrders);

        setStats(res.data?.stats || null);
      } catch (err) {
        console.error("Failed to fetch dashboard orders", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardOrders();
  }, [range]);

  const totalItems = menuItems.length;

  const inStockItems = menuItems.filter(
    (item) => item.quantityAvailable > 0 && item.isAvailable
  ).length;

  const inStockPercentage =
    totalItems > 0 ? Math.round((inStockItems / totalItems) * 100) : 0;

  return (
    <>
      {/*Navbar */}

      <Navbar />

      {/* College info */}

      <CollegeInfo />

      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900 pt-0 mt-0">
        {/* --- ENGAGING SMART HUD --- */}
        <div className="max-w-7xl mx-auto mb-10 mt-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-3xl shadow-xl text-white">
                  <Utensils size={32} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Kitchen Command
                </h1>

                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${isOpen
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-200 text-slate-500"
                      }`}
                  >
                    {isOpen && (
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                    )}
                    {isOpen ? "Canteen Open" : "Canteen Close"}
                  </span>

                  <p className="text-sm font-bold text-slate-400">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* The Modern Toggle Switch */}
            <button
              onClick={toggleOnlineStatus}
              disabled={toggleLoading}
              className={`
    relative group inline-flex h-12 w-44 items-center rounded-full
    transition-all duration-500 ease-in-out outline-none overflow-hidden
    ${isOpen
                  ? "bg-gradient-to-r from-emerald-500 to-green-600"
                  : "bg-gradient-to-r from-slate-700 to-slate-800"
                }
    ${toggleLoading ? "opacity-60 cursor-not-allowed" : ""}
  `}
            >
              {/* Inner Subtle Bevel Effect */}
              <div className="absolute inset-0 rounded-full border-t border-white/20 pointer-events-none" />

              {/* Background Text Labels */}
              <div className="relative w-full flex justify-between px-4 items-center z-10">
                <span
                  className={`
      text-[15px] font-black uppercase tracking-widest transition-all duration-500
      ${isOpen
                      ? "text-white opacity-100 translate-x-0"
                      : "text-transparent opacity-0 -translate-x-4"
                    }
    `}
                >
                  Online
                </span>

                <span
                  className={`
      text-[15px] font-black uppercase tracking-widest transition-all duration-500
      ${!isOpen
                      ? "text-slate-300 opacity-100 translate-x-0"
                      : "text-transparent opacity-0 translate-x-4"
                    }
    `}
                >
                  Offline
                </span>
              </div>

              {/* The Knob (Sliding Circle) */}
              <div
                className={`
      absolute flex items-center justify-center
      h-9 w-9 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]
      transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
      z-20
      ${isOpen ? "left-[calc(100%-40px)]" : "left-1"}
    `}
              >
                {/* Animated Icon inside Knob */}
                <div
                  className={`
      w-2.5 h-2.5 rounded-full transition-all duration-500
      ${isOpen
                      ? "bg-green-500 scale-110 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                      : "bg-slate-400 scale-100"
                    }
    `}
                />

                {/* Subtle Ring inside Knob */}
                <div className="absolute inset-1 rounded-full border border-gray-100/50" />
              </div>

              {/* Animated Glow Overlay (Pulse) */}
              {isOpen && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[shimmer_2s_infinite] pointer-events-none" />
              )}
            </button>

            {/* Add this to your Global CSS or Tailwind Config for the shimmer effect */}
            <style jsx>{`
              @keyframes shimmer {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(100%);
                }
              }
            `}</style>

            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <div className="flex-1 lg:flex-none bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-2xl">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Rush Mode
                  </p>
                  <p className="text-lg font-black text-slate-800">High</p>
                </div>
              </div>
              <div className="flex-1 lg:flex-none bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-2xl">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Avg. Prep
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {stats?.avgPrepTime ?? "--"}m
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto">
          {/* --- NEW: ENGAGING MENU MANAGEMENT SECTION --- */}
          <section className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 p-2">
                {/* Compact Glowing Icon */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-xl" />
                  <div className="group relative h-3 w-3 flex items-center justify-center cursor-pointer">
                    {/* Outer Animated Ring (Sonar Effect) */}
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping group-hover:duration-75" />

                    {/* Glassy Inner Ring */}
                    <div className="absolute inset-[-4px] rounded-full border-2 border-blue-500/20 group-hover:border-blue-500/50 transition-colors duration-500" />

                    {/* Main Container */}
                    <div
                      className={`
                        relative h-full w-full 
                        bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 
                        flex items-center justify-center 
                        rounded-full border border-blue-400/30 shadow-[0_0_20px_rgba(37,99,235,0.4)]
                        transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110
                      `}
                    >
                      {/* Inner Reflection Shine */}
                      <div className="absolute top-1 left-1 w-1/2 h-1/2 bg-white/10 rounded-full blur-[2px]" />
                    </div>
                  </div>
                </div>

                {/* Text Layout */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                      Live Menu
                    </h2>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-[9px] font-bold text-emerald-600 uppercase tracking-tighter border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Inventory Control
                  </p>
                </div>
              </div>

              {/* SERVE ORDER BUTTON */}
              <button
                onClick={() => {
                  setShowQRScanner(true);
                }}
                className="group relative flex items-center gap-4 
    bg-green-700 text-white px-7 py-3.5 rounded-xl
    font-semibold text-[13px] tracking-tight
    transition-all duration-300 hover:bg-blue-200 active:scale-[0.98]
    shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] 
    border border-slate-200 overflow-hidden hover:text-black"
              >
                {/* Professional Scan Animation: A subtle blue line that drops down on hover */}
                <div
                  className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 opacity-0 
    group-hover:opacity-100 group-hover:animate-scan-move z-10"
                />

                {/* Left Side: Minimalist Camera/Scanner Icon */}
                <div className="relative flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 011-1h2"
                    />
                  </svg>

                  {/* Subtle status dot */}
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>

                {/* Text Content */}
                <div className="flex flex-col items-start">
                  <span className="text-orange-200 font-bold tracking-wide group-hover:text-blue-700 transition-colors">
                    Serve Order
                  </span>
                  <span className="text-[10px] text-white font-medium uppercase tracking-widest group-hover:text-black">
                    Verify via QR
                  </span>
                </div>

                {/* Right Arrow: Shows only on hover to invite the click */}
                <div className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              {/* ACTION BUTTON */}
              <button
                onClick={() => setShowAddFood(true)}
                className="group relative flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  <Plus size={18} strokeWidth={3} />
                  Add New Dish
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-6">
              {/* STAT CARDS FOR MENU */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-center flex-col">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Active Items
                  </p>
                  <p className="text-3xl font-black text-slate-900">
                    {menuItems.length}
                  </p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center justify-center flex-col">
                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">
                    In Stock
                  </p>
                  <p className="text-3xl font-black text-emerald-700">
                    {inStockPercentage}%
                  </p>
                </div>
              </div>

              {/* SCROLLABLE FOOD LIST */}
              <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th
                          className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest
               w-48 max-w-48 truncate whitespace-nowrap overflow-hidden text-center "
                        >
                          Dish
                        </th>

                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest  text-center">
                          Category
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest  text-center">
                          Price
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Quantity
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                          Available
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest  text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 mb-5">
                      {menuItems.slice(0, PREVIEW_COUNT).map((item) => (
                        <tr
                          key={item._id}
                          className={
                            item.quantityAvailable >= 1
                              ? "group hover:bg-slate-50/50 transition-colors"
                              : "group hover:bg-red-400/50 transition-colors bg-red-200"
                          }
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              {/* Image Container with Glassmorphism Border */}
                              <div className="relative group/img">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-[1.2rem] blur opacity-25 group-hover/img:opacity-50 transition duration-500"></div>
                                <div className="relative w-16 h-16 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-sm bg-slate-100 flex-shrink-0">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <Utensils size={24} />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Text next to image */}
                              <div>
                                <p className="font-black text-slate-800 tracking-tight leading-none">
                                  {item.name}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                  ID: #{item._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-8 py-5  text-center">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 font-black text-slate-900  text-center">
                            ₹{item.price}
                          </td>
                          {item.quantityAvailable <= 2 ? (
                            <td className="px-8 py-5 font-black text-red-800  text-center">
                              {item.quantityAvailable}
                            </td>
                          ) : (
                            <td className="px-8 py-5 font-black text-slate-900  text-center">
                              {item.quantityAvailable}
                            </td>
                          )}
                          <td className="px-8 py-5  text-center">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleAvailability(item)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${item.quantityAvailable <= 0
                                    ? "bg-gray-400"
                                    : item.isAvailable
                                      ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                                      : "bg-slate-200"
                                  }
                                  ${item.quantityAvailable === 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${item.isAvailable
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                    }`}
                                />
                              </button>
                              <span
                                className={`text-[10px] font-black uppercase tracking-widest ${item.quantityAvailable <= 0
                                    ? "text-gray-400"
                                    : item.isAvailable
                                      ? "text-emerald-600"
                                      : "text-slate-400"
                                  }`}
                              >
                                {item.quantityAvailable <= 0
                                  ? "Stock Out"
                                  : item.isAvailable
                                    ? "Available"
                                    : "Not Available"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors"
                                onClick={() => {
                                  setEditingFood(item); // set the food being edited
                                  setFoodForm({
                                    name: item.name,
                                    price: item.price,
                                    quantityAvailable: item.quantityAvailable,
                                    category: item.category,
                                    foodType: item.foodType,
                                    description: item.description,
                                    image: null, // optional: new image can be uploaded
                                  });
                                  setShowAddFood(true); // open the same modal
                                }}
                              >
                                <Edit3 size={18} />
                              </button>

                              <button
                                onClick={() => setDeleteTarget(item)}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-center py-6">
                    <button
                      onClick={() => setShowAllMenu(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Show More ({menuItems.length - PREVIEW_COUNT} more)
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-200/60" />

          {/* --- DYNAMIC FILTER BAR --- */}
          <div className="flex items-center justify-between mb-8 bg-white/50 p-2 rounded-[2rem] border border-slate-200/60 backdrop-blur-md">
            <div className="flex gap-2">
              {["pending", "ready"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-105"
                      : "text-slate-400 hover:bg-slate-100"
                    }`}
                >
                  {tab}{" "}
                  {activeTab === tab &&
                    `(${orders.filter(
                      (o) =>
                        o.status ===
                        (tab === "pending" ? "preparing" : "ready")
                    ).length
                    })`}
                </button>
              ))}
            </div>

            <div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Range:
                </span>
                {Object.entries(RANGE_MAP).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setRange(Number(key))}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${range === Number(key)
                        ? "bg-gradient-to-r from-blue-700 to-blue-950 text-white animate-pulse"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs mr-4 hover:text-slate-600">
              <Printer size={16} /> Auto-Print: ON
            </button>
          </div>

          {/*Range */}

          {/* --- ENHANCED ORDER GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders
              .filter(
                (o) =>
                  o.status === (activeTab === "pending" ? "preparing" : "ready")
              )
              .map((order) => (
                <div
                  key={order.id}
                  className={`group bg-white rounded-[3rem] border-2 transition-all duration-500 flex flex-col relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 ${order.priority === "high"
                      ? "border-orange-100 shadow-orange-900/5"
                      : "border-transparent shadow-slate-900/5"
                    }`}
                >
                  {/* Progress Indicator */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                    <div
                      className={`h-full transition-all duration-1000 ${order.status === "ready"
                          ? "bg-green-500"
                          : order.waitTime > 20
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }
`}
                      style={{
                        width: `${order.status === "ready"
                            ? 100
                            : Math.min(order.waitTime * 20, 100)
                          }%`,
                      }}
                    ></div>
                  </div>

                  <div className="p-8 pt-10 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                          Ticket #{order.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-400 mt-1 italic flex gap-2">
                          {order.student}{" "}
                          <span className="text-sm"> ({order.rollNo})</span>
                        </h4>
                      </div>
                      {order.status !== "ready" && (
                        <div
                          className={`flex items-center gap-1.5 font-black text-[10px] uppercase px-3 py-1 rounded-full ${order.waitTime > 15
                              ? "bg-red-50 text-red-500 animate-pulse"
                              : "bg-slate-100 text-slate-400"
                            }`}
                        >
                          <Clock size={12} />{" "}
                          {order.waitTime >= 1440
                            ? `${Math.floor(
                              order.waitTime / 1440
                            )}d ${Math.floor(
                              (order.waitTime % 1440) / 60
                            )}h ago`
                            : order.waitTime >= 60
                              ? `${Math.floor(order.waitTime / 60)}h ${order.waitTime % 60
                              }m ago`
                              : `${order.waitTime}m ago`}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <p className="text-xl font-bold text-slate-800 tracking-tight">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t-3  border-dashed border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase">
                          Paid Total
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{order.total}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/*QR MODEL */}
                </div>
              ))}
          </div>
        </main>

        {/* --- ENGAGING QR MODAL --- */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-[4rem] p-12 max-w-md w-full text-center space-y-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <div className="bg-emerald-50 p-4 rounded-full text-emerald-500">
                  <Shield size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                  Ready for Pickup
                </h3>
                <p className="text-slate-500 font-bold">
                  Scanning identifies student{" "}
                  <span className="text-blue-600">{selectedOrder.student}</span>
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white border-8 border-slate-50 p-8 rounded-[3rem] inline-block shadow-inner">
                  <QrCode size={180} className="text-slate-900" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6 grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Order ID
                  </p>
                  <p className="font-bold text-slate-900">{selectedOrder.id}</p>
                </div>
                <div className="text-left border-l border-slate-200 pl-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Status
                  </p>
                  <p className="font-bold text-emerald-500">Payment Verified</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setOrders(orders.filter((o) => o.id !== selectedOrder.id));
                  setSelectedOrder(null);
                }}
                className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Skip Scan / Direct Handover
              </button>
            </div>
          </div>
        )}
      </div>

      {/*Show all menu */}
      {showAllMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] max-w-10xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 w-10xl ">
              <h3 className="text-xl font-black tracking-tight">
                Full Menu List
              </h3>
              <button
                onClick={() => setShowAllMenu(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL TABLE */}
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">
                      DISH
                    </th>

                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">
                      Category
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">
                      Price
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Quantity
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Available
                    </th>

                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {menuItems.map((item) => (
                    <tr
                      key={item._id}
                      className={
                        item.quantityAvailable >= 1
                          ? "group hover:bg-slate-50/50 transition-colors"
                          : "group hover:bg-red-400/50 transition-colors bg-red-200"
                      }
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          {/* Image Container with Glassmorphism Border */}
                          <div className="relative group/img">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-[1.2rem] blur opacity-25 group-hover/img:opacity-50 transition duration-500"></div>
                            <div className="relative w-16 h-16 rounded-[1.2rem] overflow-hidden border-2 border-white shadow-sm bg-slate-100 flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Utensils size={24} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Text next to image */}
                          <div>
                            <p className="font-black text-slate-800 tracking-tight leading-none">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                              ID: #{item._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black">₹{item.price}</td>

                      {item.quantityAvailable <= 2 ? (
                        <td className="px-8 py-5 font-black text-red-800">
                          {item.quantityAvailable}
                        </td>
                      ) : (
                        <td className="px-8 py-5 font-black text-slate-900">
                          {item.quantityAvailable}
                        </td>
                      )}

                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleAvailability(item)}
                            disabled={item.quantityAvailable === 0}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${item.quantityAvailable <= 0
                                ? "bg-gray-400"
                                : item.isAvailable
                                  ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                                  : "bg-slate-200"
                              }
        ${item.quantityAvailable === 0
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${item.isAvailable
                                  ? "translate-x-6"
                                  : "translate-x-1"
                                }`}
                            />
                          </button>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${item.quantityAvailable <= 0
                                ? "text-gray-400"
                                : item.isAvailable
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                          >
                            {item.quantityAvailable <= 0
                              ? "Stock Out"
                              : item.isAvailable
                                ? "Available"
                                : "Not Available"}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors"
                            onClick={() => {
                              setEditingFood(item); // set the food being edited
                              setFoodForm({
                                name: item.name,
                                price: item.price,
                                quantityAvailable: item.quantityAvailable,
                                category: item.category,
                                foodType: item.foodType,
                                description: item.description,
                                image: null, // optional: new image can be uploaded
                              });
                              setShowAddFood(true); // open the same modal
                            }}
                          >
                            <Edit3 size={18} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-xl"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Corfirm to delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                <AlertCircle size={28} />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                Delete Food Item?
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                This will permanently remove
                <span className="font-bold text-slate-700">
                  {" "}
                  {deleteTarget.name}
                </span>
                . This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteFood}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Add food */}
      {showAddFood && (
        <div className="fixed inset-0 z-110 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          {/* Added max-h-[90vh] and flex-col to ensure it stays within screen bounds */}
          <div className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* FIXED HEADER */}
            <div className="shrink-0 relative bg-gradient-to-r from-green-600 to-green-600 px-8 py-5 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {editingFood ? "Update Food" : "Add New Food"}
                  </h2>
                  <p className="text-green-100 text-xs opacity-90 font-medium">
                    Update your menu in real-time
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddFood(false);
                    setEditingFood(null);
                    setFoodForm({
                      name: "",
                      price: "",
                      quantityAvailable: "",
                      category: "snacks",
                      foodType: "veg",
                      description: "",
                      image: null,
                    });
                  }}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 custom-scrollbar">
              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spicy Paneer Tikka"
                    value={foodForm.name}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, name: e.target.value })
                    }
                    className="w-full mt-1 border-gray-200 border-2 rounded-xl px-4 py-2.5 focus:border-green-500 focus:ring-0 transition-all outline-none bg-gray-50/50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={foodForm.price}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, price: e.target.value })
                    }
                    className="w-full mt-1 border-gray-200 border-2 rounded-xl px-4 py-2.5 focus:border-green-500 focus:ring-0 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={foodForm.quantityAvailable}
                    onChange={(e) =>
                      setFoodForm({
                        ...foodForm,
                        quantityAvailable: e.target.value,
                      })
                    }
                    className="w-full mt-1 border-gray-200 border-2 rounded-xl px-4 py-2.5 focus:border-green-500 focus:ring-0 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Selectors Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={foodForm.category}
                      onChange={(e) =>
                        setFoodForm({ ...foodForm, category: e.target.value })
                      }
                      className="w-full mt-1 appearance-none border-gray-200 border-2 rounded-xl px-4 py-2.5 focus:border-green-500 transition-all outline-none bg-white cursor-pointer"
                    >
                      <option value="snacks">🍿 Snacks</option>
                      <option value="meal">🍱 Meal</option>
                      <option value="drink">🥤 Drink</option>
                      <option value="sweet">🍰 Sweet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                    Dietary Type
                  </label>
                  <select
                    value={foodForm.foodType}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, foodType: e.target.value })
                    }
                    className="w-full mt-1 appearance-none border-gray-200 border-2 rounded-xl px-4 py-2.5 focus:border-green-500 transition-all outline-none bg-white cursor-pointer"
                  >
                    <option value="veg">🟢 Veg</option>
                    <option value="non-veg">🔴 Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe the taste..."
                  rows="2"
                  value={foodForm.description}
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, description: e.target.value })
                  }
                  className="w-full mt-1 border-gray-200 border-2 rounded-xl px-4 py-2.5 focus:border-green-500 transition-all outline-none resize-none"
                />
              </div>

              {/* Compact Image Upload */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                  Food Photo
                </label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-all">
                    <div className="flex flex-col items-center justify-center py-2">
                      <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500 italic">
                        {foodForm.image
                          ? foodForm.image.name
                          : "PNG, JPG up to 5MB"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setFoodForm({ ...foodForm, image: e.target.files[0] })
                      }
                    />
                  </label>
                </div>
                {foodForm.image && (
                  <div className="mt-2 flex items-center gap-2 text-green-600 text-[11px] font-bold uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5" />
                    File: {foodForm.image.name}
                  </div>
                )}
              </div>
            </div>

            {/* FIXED FOOTER ACTION */}
            <div className="shrink-0 p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleAddOrEditFood}
                disabled={addingFood}
                className="w-full py-3.5 bg-green-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:bg-gray-300 disabled:shadow-none"
              >
                {addingFood ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : editingFood ? (
                  "Save Changes"
                ) : (
                  "Confirm & Add Food"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showQRScanner && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative border border-white/20">
            {/* Top Decoration Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    Order Scanner
                  </h2>
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                    Point camera at customer QR
                  </p>
                </div>
                <button
                  onClick={() => {
                    stopCamera();
                    setShowQRScanner(false);
                  }}
                  className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Camera View Container */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-square shadow-inner border-[6px] border-slate-50">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover opacity-90"
                />

                <canvas ref={canvasRef} className="hidden" />

                {/* Professional Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner Brackets */}
                  <div className="absolute inset-12 border-2 border-transparent">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
                  </div>

                  {/* The Animated Laser Line */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan-line shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                </div>

                {/* Subtle Dark Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.3)_100%)]" />
              </div>

              {/* Footer Info */}
              <div className="mt-6 flex items-center justify-center gap-3 py-3 px-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-700">
                  System Ready: Awaiting QR...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && scannedOrder && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-[420px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
            {/* Top Banner: Status & User */}
            <div className="relative bg-slate-50 pt-12 pb-8 px-10 text-center">
              {/* Floating Paid Badge */}
              <div className="absolute top-6 right-8">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${scannedOrder.paymentStatus === "paid"
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                    }`}
                >
                  {scannedOrder.paymentStatus || "Unpaid"}
                </span>
              </div>

              {/* User Avatar & Info */}



              <div className="px-0 pb-0 -mt-1 text-center">
                <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
                  <Check
                    className="text-emerald-600"
                    size={32}
                    strokeWidth={3}
                  />
                </div>
              </div>


              <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                {scannedOrder.studentId.studentName || "Student User"}
              </h3>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-[0.15em] mt-2">
                ID: {scannedOrder.studentId.rollNo || "Not Provided"}
              </p>
            </div>

            <div className="px-10 pb-10 pt-6">
              {/* Order Details Grid */}
              <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
                <div className="space-y-4">
                  {scannedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-black text-slate-800">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Grand Total
                    </span>
                    <span className="text-2xl font-black text-blue-600">
                      ₹{scannedOrder.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Reference Footer */}
              <div className="text-center mb-8 ">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Transaction Code :-
                </p>
                <p className="text-[11px] text-slate-600 font-mono mt-1">
                  {scannedOrder.transactionCode || "CASH_TRANSACTION"}
                </p>
              </div>
              <div className="text-center mb-8 ">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Transaction Reference :-
                </p>
                <p className="text-[11px] text-slate-600 font-mono mt-1">
                  {scannedOrder.razorpayPaymentId || "CASH_TRANSACTION"}
                </p>
              </div>

              {/* --- THE MODERN SWIPE SLIDER --- */}

              {scannedOrder.orderStatus !== "served" && (
                <div
                  id="swipe-track"
                  className="relative h-16 bg-slate-100 rounded-full p-2 flex items-center select-none overflow-hidden"
                >
                  <div
                    className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-75"
                    style={{ width: `${swipeProgress}%` }}
                  />

                  <p
                    className={`absolute inset-0 flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] transition-opacity duration-300 
            ${swipeProgress > 20 ? "opacity-0" : "opacity-40 text-slate-600"}`}
                  >
                    Swipe to Confirm
                  </p>

                  <div
                    onMouseDown={() =>
                      !isProcessing && (isDragging.current = true)
                    }
                    className={`relative z-10 h-12 w-12 rounded-full shadow-xl flex items-center justify-center 
    ${isProcessing
                        ? "bg-slate-200 cursor-wait"
                        : "bg-white cursor-grab active:cursor-grabbing"
                      }`}
                    style={{
                      position: "absolute",
                      left: `calc(${swipeProgress}% - ${swipeProgress > 85 ? "52px" : "0px"
                        })`,
                      transition: isDragging.current
                        ? "none"
                        : "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronRight
                        className="text-emerald-500"
                        size={24}
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
              )}

              {scannedOrder.orderStatus === "served" && (
                <div
                  id="swipe-track"
                  className="relative h-16 bg-green-700 rounded-full p-2 flex items-center select-none overflow-hidden"
                >
                  <p
                    className={`absolute inset-0 flex items-center justify-center text-xs text-white font-black uppercase`}
                  >
                    Already Served
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full mt-6 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
              >
                Discard Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-emerald-500/20 backdrop-blur-md flex items-center justify-center z-[120] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-[350px] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
            {/* Animated Checkmark Circle */}
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200/50">
              <CheckCircle2
                className="text-emerald-500 animate-bounce"
                size={48}
                strokeWidth={3}
              />
            </div>

            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              Order Served!
            </h3>
            <p className="text-sm text-slate-400 font-medium mt-2">
              The order has been moved to the{" "}
              <span className="text-emerald-500 font-bold">Served</span> list.
            </p>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95"
              >
                Great, Next!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
}
