import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  Clock,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  LayoutGrid,
  Zap,
  ChevronRight,
  Plus,
  Coffee,
  Utensils,
  Star,
  Calendar,
  User,
  LineChart,
  Loader2,
  CreditCard,
} from "lucide-react";
import ProfileSidebar from "../Components/ProfileSidebar";
// import CollegeInfo from "../Components/CollegeInfo";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Components/Navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.studentName || "Student",
    activeIssue: null,
    libraryHistory: [],
    campusComplaints: [],
    canteenOrders: [],
  });
  const [canteenFoods, setCanteenFoods] = useState([]);
  const [previewFoods, setPreviewFoods] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeOrderCount, setActiveOrderCount] = useState(0);

  useEffect(() => {
    const fetchMyOrderHistory = async () => {
      try {
        setLoadingHistory(true);

        const res = await axios.get(
          `${API_URL}/api/v1/canteen/orders/my-history`,
          { withCredentials: true }
        );

        const history = res.data?.data || [];

        const normalizedHistory = history.map((order) => ({
          id: order._id,
          code: order._id.slice(-6).toUpperCase(),
          items: order.items || [],
          total: order.totalAmount || 0,
          status: order.orderStatus,
          createdAt: order.createdAt,
        }));

        setOrderHistory(normalizedHistory);
      } catch (err) {
        console.error("Failed to fetch order history", err);
        setOrderHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchMyOrderHistory();
  }, []);

  const isToday = (dateString) => {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const orderDate = new Date(dateString);

    return orderDate >= startOfDay && orderDate <= endOfDay;
  };

  const todayExpense = orderHistory
    .filter((order) => isToday(order.createdAt))
    .reduce((sum, order) => sum + (order.total || 0), 0);

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await axios.get(`${API_URL}/api/v1/canteen/foods`, {
        withCredentials: true,
      });

      setCanteenFoods(res.data.data.foods || []);
    };

    fetchFoods();
  }, []);

  useEffect(() => {
    // Filter for ONLY available food
    // We use Boolean(food.isAvailable) to handle true/false/undefined safely

    const available = canteenFoods.filter((item) => item.isAvailable === true);

    // If this is for a "Top Picks" or "Preview" section, keep the slice
    // Otherwise, remove .slice(0, 5) to show the full menu
    setPreviewFoods(available.slice(0, 5));
  }, [canteenFoods]);

  useEffect(() => {
    if (orderHistory.length <= 0) {
      setActiveOrderCount(0);

      return;
    }

    // const activeOrders = orderHistory.filter(
    //   (order) => order.status === "Order_Received"
    // );
    const activeOrders = orderHistory.filter(
      (order) => order.status === "order_received"
    );

    setActiveOrderCount(activeOrders.length);
  }, [orderHistory]);

  const fetchCurrentStudent = async () => {
    const res = await axios.get(`${API_URL}/api/v1/users/student/profile `, {
      withCredentials: true,
    });

    return res.data.data; // ApiResponse → data
  };
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const data = await fetchCurrentStudent();

        setStudent(data);
      } catch (err) {
        console.error("Failed to fetch student", err);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  const StatWidget = ({ label, value, subText, icon, progress, color }) => (
    <div className="bg-white/80 border border-slate-100 p-5 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <span className="text-sm font-black text-slate-900 tracking-tighter">
          {value}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  const ActivityItem = ({ time, title, color }) => (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div
        className={`w-1.5 h-1.5 rounded-full ${color} group-hover:scale-150 transition-transform`}
      ></div>
      <span className="text-[10px] font-bold text-slate-400 w-10">{time}</span>
      <span className="text-[11px] font-black text-slate-700 group-hover:text-indigo-600 transition-colors">
        {title}
      </span>
    </div>
  );

  // 1. ADD THIS TO YOUR TOP-LEVEL CSS OR A STYLE TAG
  const globalStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }
`;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 1. Fetch Student History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/library/my/history`, {
          withCredentials: true,
        });

        setHistory(res.data.data || []); // Adjust based on your actual API response structure
      } catch (error) {
        console.error("Failed to fetch library history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // 2. Dynamic Filtering
  const activeBooks = history.filter(
    (b) => b.transactionStatus === "pending" || b.transactionStatus === "issued"
  );

  // 3. Handle Return/Payment Flow
  const handleReturnInitiation = async (transactionId, fineAmount) => {
    setProcessingId(transactionId);
    try {
      if (fineAmount > 0) {
        // Step A: Create Razorpay Order if there is a fine
        const orderRes = await axios.patch(
          `${API_URL}/api/v1/library/return/pay/${transactionId}`,
          {},
          { withCredentials: true }
        );

        // Step B: Trigger Razorpay Modal (Pseudo-code)
        // openRazorpayModal(orderRes.data.order, async (response) => {
        //    await axios.post(`${API_URL}/api/v1/library/return/verify`, response);
        //    refreshHistory();
        // });
      } else {
        // If no fine, the student usually just goes to the librarian to scan QR
        alert("Please visit the librarian to finalize the return via QR Scan.");
      }
    } catch (err) {
      console.error("Return initiation failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
          Accessing Archives...
        </p>
      </div>
    );

  const LibraryPage = () => {
    return (
  <div className="space-y-8 sm:space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 mb-9 overflow-x-hidden">

  {/* HERO SECTION */}
  <section className="relative">
    <div className="absolute -top-20 -right-20 sm:-top-24 sm:-right-24 
      w-64 sm:w-96 h-64 sm:h-96 
      bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />

    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 px-2">




{/* <div className="space-y-4">
  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500">
    Inventory System
  </span>

  <h2 className="text-4xl sm:text-5xl lg:text-6xl 
    font-black tracking-tighter text-slate-900">
    The{" "}
    <span className="italic text-indigo-600">
      Stacks<span className="text-violet-500">.</span>
    </span>
  </h2>

  <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full" />
</div>



      <div className="px-4 sm:px-6 py-2.5 sm:py-4 
        rounded-2xl sm:rounded-[2rem]
        border border-white bg-white/60 backdrop-blur-md shadow-lg">
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Knowledge Rank
        </p>
        <p className="text-base sm:text-xl font-black text-slate-900 italic">
          Top 5%
        </p>
      </div> */}



      
    </div>
  </section>

  {/* HISTORY LEDGER */}
  <section>
    <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4">
      <div className="h-px flex-1 bg-slate-100" />
      <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.45em]">
        Your Shelf
      </h3>
      <div className="h-px flex-1 bg-slate-100" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-6 sm:mt-10">
      {activeBooks.length > 0 ? (
        activeBooks.map((record, index) => (
          <div
            key={record._id}
            className={`
              ${index === 0 ? "lg:col-span-7" : "lg:col-span-5"}
              group relative overflow-hidden
              rounded-[2rem] sm:rounded-[3.5rem]
              bg-slate-900
              min-h-[300px] sm:min-h-[400px]
              transition-all duration-700
              hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]
            `}
          >
            {/* BACKGROUND */}
            <div className="absolute inset-0">
              <img
                src={record.bookId?.coverImage || "/fallback-cover.jpg"}
                alt=""
                className="w-full h-full object-cover opacity-50 
                  group-hover:opacity-30 group-hover:scale-110 
                  transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t 
                from-slate-900 via-slate-900/60 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 h-full flex flex-col justify-between 
              p-4 sm:p-10">

              {/* TOP */}
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        record.transactionStatus === "issued"
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                      {record.transactionStatus === "issued"
                        ? "In Your Possession"
                        : "Awaiting Issue"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-4xl font-black tracking-tight 
                    text-white mt-3 max-w-[90%] leading-tight">
                    {record.bookId?.title || "Unknown Title"}
                  </h3>

                  <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1.5">
                    By {record.bookId?.author || "Internal Archive"}
                  </p>
                </div>

                <div className="p-2.5 sm:p-4 bg-white/10 backdrop-blur-xl 
                  rounded-xl sm:rounded-2xl border border-white/20">
                  <Zap
                    size={16}
                    className={record.fine > 0 ? "text-amber-400" : "text-white"}
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* BOTTOM */}
              <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row 
                items-stretch sm:items-center justify-between gap-4 sm:gap-6">

                <div className="bg-black/20 backdrop-blur-md p-3 sm:p-4 
                  rounded-2xl sm:rounded-3xl border border-white/5">
                  <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                    Fine
                  </p>
                  <p
                    className={`text-lg sm:text-2xl font-black italic ${
                      record.fine > 0 ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    ₹{record.fine || 0}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleReturnInitiation(record._id, record.fine)
                  }
                  disabled={processingId === record._id}
                  className="relative w-full sm:w-auto
                    px-6 sm:px-10 py-3.5 sm:py-5
                    bg-white text-slate-900
                    rounded-xl sm:rounded-[2rem]
                    text-[9px] sm:text-[10px]
                    font-black uppercase tracking-widest
                    overflow-hidden transition-all
                    hover:scale-105 active:scale-95
                    disabled:opacity-50">

                  <div className="absolute inset-0 bg-indigo-600 
                    translate-y-full hover:translate-y-0 transition-transform" />

                  <span className="relative z-10 flex items-center justify-center gap-2 hover:text-white transition-colors">
                    {processingId === record._id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <>
                        {record.fine > 0 ? "Settle & Return" : "Initiate Return"}
                        <ArrowRight size={14} strokeWidth={3} />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-slate-300 italic py-10">
          No records found in the archive.
        </p>
      )}
    </div>
  </section>
</div>


    );
  };

  const OrdersPage = ({ canteenOrders }) => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8 md:space-y-12">

  {/* 1. HEADER */}
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 
    bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] 
    border border-slate-100 shadow-sm relative overflow-hidden group">

    {/* Decorative Mesh */}
    <div className="absolute top-0 right-0 w-56 md:w-64 h-56 md:h-64 
      bg-orange-100/30 rounded-full blur-3xl -mr-20 -mt-20 
      group-hover:bg-orange-200/40 transition-colors duration-700" />

    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        <h3 className="text-[9px] md:text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">
          Kitchen Live
        </h3>
      </div>

      <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
        Food Feed<span className="text-orange-500">.</span>
      </h2>

      <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
        Real-time order tracking
      </p>
    </div>

    <div className="flex items-center gap-4 relative z-10">
      <div className="hidden sm:block text-right border-r border-slate-100 pr-4 md:pr-6">
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Today's Spend
        </p>
        <p className="text-lg md:text-xl font-black text-slate-900 italic">
          ₹{todayExpense.toFixed(2)}
        </p>
      </div>

      <Link to="/canteen">
        <button className="group relative flex sm:items-center gap-2 
          bg-slate-900 text-white 
          px-6 md:px-8 py-3 md:py-4 
          rounded-xl md:rounded-2xl 
          font-black text-[10px] md:text-xs uppercase tracking-widest 
          overflow-hidden transition-all hover:scale-105 active:scale-95 items-end justify-end">

          <span className="relative z-10 flex items-center gap-2">
            New Order <Plus size={14} strokeWidth={3} />
          </span>

          <div className="absolute inset-0 bg-gradient-to-r 
            from-orange-600 to-amber-500 
            opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </Link>
    </div>
  </div>

  {/* 2. ORDERS LIST */}
  <div className="grid grid-cols-1 gap-3 md:gap-4">
    {canteenOrders.map((order) => (
      <div
        key={order._id}
        className="group relative bg-white border border-slate-100 
          rounded-[1.75rem] md:rounded-[2.5rem] 
          p-4 md:p-5 
          flex flex-col md:flex-row 
          md:items-center md:justify-between 
          transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]">

        <div className="flex items-center gap-4 w-full">
          <div
            className={`w-14 h-14 md:w-20 md:h-20 
              rounded-xl md:rounded-[2rem] 
              flex items-center justify-center shrink-0 transition-all ${
              order.status === "Ready"
                ? "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"
                : "bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
            }`}
          >
            {order.item?.toLowerCase().includes("coffee") ? (
              <Coffee size={22} />
            ) : (
              <Utensils size={22} />
            )}
          </div>

          <div>
            <h4 className="text-base md:text-xl font-black text-slate-900 leading-tight">
              {order.item}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                {order._id.slice(-6).toUpperCase()}
              </span>
              <span className="text-slate-300">•</span>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Pay on Pickup
              </p>
            </div>
          </div>
        </div>

        {/* PRICE + STATUS */}
        <div className="flex items-center justify-between md:justify-end 
          gap-6 mt-4 md:mt-0 pt-4 md:pt-0 
          border-t md:border-t-0 border-slate-50">

          <div className="text-left md:text-right">
            <p className="text-xl md:text-2xl font-black text-slate-900 italic">
              ₹{order.price || "45"}
            </p>
            <p className="text-[8px] md:text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">
              Cash / UPI
            </p>
          </div>

          <div className="relative">
            <div
              className={`h-12 w-12 md:h-14 md:w-14 rounded-full border-[3px] 
                flex items-center justify-center transition-all ${
                order.status === "Ready"
                  ? "border-orange-100 border-t-orange-500 animate-spin-slow"
                  : "border-emerald-500"
              }`}
            >
              {order.status === "Ready" ? (
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              ) : (
                <Check size={14} className="text-emerald-500" strokeWidth={3} />
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* 3. FOOTER BENTO */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <div className="md:col-span-2 bg-indigo-600 rounded-[2rem] md:rounded-[3rem] 
      p-6 md:p-8 text-white flex items-center justify-between relative overflow-hidden">

      <div>
        <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">
          Chef's Special
        </h5>
        <p className="text-xl md:text-2xl font-black italic">
          Double Cheese Margherita
        </p>
        <p className="text-xs opacity-80 mt-1">Available till 4:00 PM</p>
      </div>

      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl 
        flex items-center justify-center border border-white/20">
        <ChevronRight size={20} />
      </div>
    </div>

    <Link to="/orders">
      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] md:rounded-[3rem] 
        p-6 md:p-8 text-center hover:bg-white hover:shadow-xl transition-all">

        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Active Orders
        </p>

        {activeOrderCount > 0 ? (
          <span className="inline-block mt-2 px-3 py-1 text-xs font-black 
            rounded-full bg-red-100 text-red-600 animate-pulse">
            {activeOrderCount} Active
          </span>
        ) : (
          <p className="text-3xl font-black text-slate-900 italic mt-2">
            00
          </p>
        )}

        <p className="text-[9px] font-bold text-slate-400 mt-2">
          Tickets in progress
        </p>
      </div>
    </Link>
  </div>
</div>

    );
  };

  const ComplaintsPage = ({ campusComplaints }) => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8 sm:space-y-12">

  {/* 1. HERO SECTION */}
  <div
    className="group relative bg-slate-900 
    rounded-[2rem] sm:rounded-[3.5rem] 
    p-6 sm:p-12 
    overflow-hidden shadow-2xl shadow-slate-200"
  >
    {/* Background Blobs */}
    <div className="absolute top-0 right-0 w-56 sm:w-96 h-56 sm:h-96 bg-orange-500/20 rounded-full blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

      {/* LEFT */}
      <div>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="h-px w-10 sm:w-12 bg-orange-500" />
          <span className="text-[9px] sm:text-[10px] font-black text-orange-400 uppercase tracking-[0.4em]">
            Support Center
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4 sm:mb-6">
          Pulse Check<span className="text-orange-500">.</span>
        </h2>

        <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-md mb-6 sm:mb-10">
          Your voice drives campus evolution. Report issues and track resolutions
          in real-time.
        </p>

        <Link to="/report">
          <button
            className="group/btn relative 
            px-6 sm:px-8 py-3.5 sm:py-5 
            bg-white rounded-xl sm:rounded-2xl 
            overflow-hidden transition-all 
            hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-slate-900 font-black text-[10px] sm:text-xs uppercase tracking-widest">
              File New Report
              <Plus size={16} strokeWidth={3} className="text-orange-500" />
            </span>
            <div className="absolute inset-0 bg-orange-50 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
          </button>
        </Link>
      </div>

      {/* RIGHT STATS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem]">
          <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase mb-1 sm:mb-2">
            Active Tickets
          </p>
          <p className="text-2xl sm:text-4xl font-black text-white italic">
            {campusComplaints.filter(c => c.status !== "Resolved").length}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem]">
          <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase mb-1 sm:mb-2">
            Avg. Resolve
          </p>
          <p className="text-2xl sm:text-4xl font-black text-white italic">
            ~18h
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* 2. COMPLAINT GRID */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
    {campusComplaints.map((item) => (
      <div
        key={item._id}
        className="group relative bg-white border border-slate-100 
        rounded-[2rem] sm:rounded-[3rem] 
        p-5 sm:p-8 
        transition-all duration-500 
        hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)]"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-5 sm:mb-8">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 sm:px-3 py-1 bg-slate-100 rounded-lg text-[8px] sm:text-[9px] font-black text-slate-500 uppercase">
                #{item._id.slice(-6)}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] sm:text-[9px] font-black uppercase">
                Infrastructure
              </span>
            </div>

            <h4 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
              {item.subject}
            </h4>
          </div>

          <div
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase flex items-center gap-2 ${
              item.status === "Resolved"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item.status === "Resolved"
                  ? "bg-emerald-500"
                  : "bg-orange-500 animate-pulse"
              }`}
            />
            {item.status}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-500 text-sm mb-5 sm:mb-8 line-clamp-2">
          {item.description ||
            "System generated: Initial intake for campus grievance awaiting review."}
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400"
              >
                Admin
              </div>
            ))}
          </div>

          <button className="flex items-center gap-2 text-slate-900 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em]">
            Review Thread
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
        <ProfileSidebar
          isOpen={showProfileMenu}
          onClose={() => setShowProfileMenu(false)}
        />

        {/* Background Decorative Blobs */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-[120px] -z-10" />
        <div className="fixed bottom-10 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-[120px] -z-10" />

        <div className="flex overflow-hidden pt-20 lg:pt-0">
          {/* --- LEFT NAVIGATION --- */}
          <aside className="w-20 lg:w-72 hidden lg:flex flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-md">
            <div className="p-8 hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tighter">
                STUDENT<span className="text-indigo-600">HUB.</span>
              </span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
              <NavItem
                icon={<LayoutGrid size={20} />}
                label="Dashboard"
                active={activeTab === "Overview"}
                onClick={() => setActiveTab("Overview")}
              />
              <NavItem
                icon={<BookOpen size={20} />}
                label="My Library"
                active={activeTab === "Library"}
                onClick={() => setActiveTab("Library")}
              />
              <NavItem
                icon={<ShoppingBag size={20} />}
                label="Food Orders"
                active={activeTab === "Orders"}
                onClick={() => setActiveTab("Orders")}
              />
              <NavItem
                icon={<AlertCircle size={20} />}
                label="Support"
                active={activeTab === "Complaints"}
                onClick={() => setActiveTab("Complaints")}
              />
            </nav>

            <div className="p-6 m-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] text-white hidden lg:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Need Help?
              </p>
              <p className="text-xs leading-relaxed opacity-80">
                Contact administration for campus inquiries.
              </p>
              <button className="mt-4 w-full py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-50 transition-colors">
                Contact
              </button>
            </div>
          </aside>

          {/* ===== MOBILE TOP NAV ===== */}
          <div className="lg:hidden fixed top-[52px] left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
            <nav className="flex justify-around px-2 py-2">
              <button
                onClick={() => setActiveTab("Overview")}
                className={`flex flex-col items-center gap-1 text-xs font-bold ${
                  activeTab === "Overview"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
              >
                <LayoutGrid size={20} />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("Library")}
                className={`flex flex-col items-center gap-1 text-xs font-bold ${
                  activeTab === "Library" ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <BookOpen size={20} />
                Library
              </button>

              <button
                onClick={() => setActiveTab("Orders")}
                className={`flex flex-col items-center gap-1 text-xs font-bold ${
                  activeTab === "Orders" ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <ShoppingBag size={20} />
                Orders
              </button>

              <button
                onClick={() => setActiveTab("Complaints")}
                className={`flex flex-col items-center gap-1 text-xs font-bold ${
                  activeTab === "Complaints"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
              >
                <AlertCircle size={20} />
                Support
              </button>
            </nav>
          </div>

          {/* --- MAIN CONTENT AREA --- */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar bg-transparent">
            <main className="px-2 lg:p-12">
              {/* Header / Greeting */}
              <header className="mb-10 px-4">
                <p className="text-indigo-600 font-bold text-sm tracking-wide">
                  Welcome back,
                </p>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mt-1">
                  Hey, {student?.fullName}! 👋
                </h1>
              </header>

              {/* Dynamic Content Switcher */}
              {activeTab === "Overview" ? (
                <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  {/* 1. HERO BENTO CARD */}
                  <section className="relative group">
                    {/* Glow */}
                    <div
                    className="bg-gradifrom-into-purple-600 
                      rounded-[2.5rem] lg:rounded-[3.5rem] blur opacity-25 
                      group-hover:opacity-50 transition duration-1000                   group-hover:duration-200"
                    />

                    <div
                      className="relative overflow-hidden bg-white 
      rounded-[2.5rem] lg:rounded-[3rem] 
      p-5 sm:p-8 lg:p-14 
      shadow-2xl shadow-indigo-100/50 border border-slate-100"
                    >
                      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 items-center gap-6 sm:gap-12">
                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                          <div className="flex items-center gap-2">
                            <span
                              className="bg-indigo-600 text-white px-3 sm:px-4 py-1.5 
              rounded-full text-[9px] sm:text-[10px] 
              font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200"
                            >
                              {userData.issuedBooks
                                ? "Reading Now"
                                : "Discovery Mode"}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>

                          <h2
                            className="text-3xl sm:text-4xl lg:text-6xl 
            font-black text-slate-900 tracking-tighter 
            leading-tight lg:leading-[0.9]"
                          >
                            {userData.issuedBooks ? (
                              <>
                                Focusing on{" "}
                                <span className="text-indigo-600 italic">
                                  "{userData.issuedBooks.bookId.title}"
                                </span>
                              </>
                            ) : (
                              <>
                                Fuel your{" "}
                                <span
                                  className="text-transparent bg-clip-text 
                  bg-gradient-to-r from-indigo-600 to-purple-500"
                                >
                                  Curiosity.
                                </span>
                              </>
                            )}
                          </h2>

                          <p
                            className="text-sm sm:text-base lg:text-lg 
            text-slate-500 font-medium leading-relaxed max-w-md"
                          >
                            {userData.activeIssue
                              ? `You've got until ${new Date(
                                  userData.activeIssue.expiresAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })} to finish this masterpiece.`
                              : "Access over 50,000 titles instantly. Your next big idea is waiting in the stacks."}
                          </p>

                          <div className="pt-2 sm:pt-4">
                            <Link to="/library">
                              <button
                                onClick={() => setActiveTab("Library")}
                                className="group/btn relative 
                  px-6 sm:px-8 py-3 sm:py-4 
                  bg-slate-900 text-white 
                  rounded-xl sm:rounded-2xl 
                  font-black text-[10px] sm:text-xs 
                  uppercase tracking-widest 
                  overflow-hidden transition-all 
                  hover:scale-105 active:scale-95"
                              >
                                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                  {userData.activeIssue
                                    ? "Open Reader"
                                    : "Explore Library"}
                                  <ArrowRight
                                    size={16}
                                    className="group-hover/btn:translate-x-1 transition-transform"
                                  />
                                </span>
                                <div
                                  className="absolute inset-0 bg-gradient-to-r 
                  from-indigo-600 to-purple-600 opacity-0 
                  group-hover/btn:opacity-100 transition-opacity"
                                />
                              </button>
                            </Link>
                          </div>
                        </div>

                        {/* RIGHT VISUAL */}
                        <div className="lg:col-span-2 flex justify-center">
                          <div
                            className="relative 
            w-44 h-56 sm:w-56 sm:h-72 
            bg-slate-900 rounded-[2rem] 
            shadow-[25px_25px_50px_-12px_rgba(0,0,0,0.5)] 
            transform rotate-y-12 -rotate-x-6 
            group-hover:rotate-0 transition-all duration-700 
            overflow-hidden border-r-[12px] border-slate-800"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="h-full w-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
                              <BookOpen
                                size={48}
                                className="sm:size-[60px] text-indigo-400 mb-4 animate-float"
                              />
                              <div className="h-1 w-10 sm:w-12 bg-indigo-500 rounded-full mb-2" />
                              <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.3em]">
                                Official Archive
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 2. SECONDARY GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* CANTEEN */}
                    <div
                      className="lg:col-span-2 bg-white/70 backdrop-blur-xl 
      rounded-[2.5rem] lg:rounded-[3rem] 
      border border-white 
      p-5 sm:p-8 lg:p-10 pb-1 
      shadow-xl shadow-slate-200/50"
                    >
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <h3 className="font-black text-lg sm:text-2xl text-slate-900">
                            Recent Cravings
                          </h3>
                          <p className="text-slate-400 text-[8px] sm:text-xs font-bold uppercase tracking-widest">
                            Live from the canteen
                          </p>
                        </div>

                        <button
                          onClick={() => navigate("/canteen")}
                          className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
                        >
                          <LayoutGrid size={18} />
                        </button>
                      </div>

                      <div className="grid gap-3">
                        {previewFoods.map((food) => (
                          <div
                            key={food._id}
                            className="flex items-center justify-between 
              p-3 bg-white border border-slate-100 
              rounded-2xl transition-all hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={food.image}
                                alt={food.name}
                                className="w-12 h-12 rounded-xl object-cover shadow"
                              />
                              <div>
                                <h4 className="font-black text-sm text-slate-900 text-[13px] sm:text-[15px]">
                                  {food.name}
                                </h4>
                                <p className="text-[9px] uppercase font-bold text-slate-400">
                                  {food.category || "Main"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center sm:gap-3 gap-1">
                              <span className="font-black text-sm italic">
                                ₹{food.price}
                              </span>
                              <button className="sm:w-9 p-1 sm:h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white">
                                <Plus size={16} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CAMPUS PULSE */}
                    <div
                      className="bg-slate-900 rounded-[2.5rem] lg:rounded-[3.5rem] 
      p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden mb-5"
                    >
                      <h3 className="font-black text-2xl sm:text-3xl italic mb-2">
                        Campus Pulse<span className="text-indigo-500">.</span>
                      </h3>
                      <p className="text-slate-400 text-sm mb-6">
                        All infrastructure systems are performing at peak.
                      </p>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <p className="text-[9px] uppercase tracking-widest text-indigo-400 mb-1">
                          Recent Report Status
                        </p>
                        <p className="font-bold text-sm">
                          {userData.campusComplaints[0]?.subject ||
                            "System Clear: No active hazards detected."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "Library" ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <LibraryPage userData={userData} />
                </div>
              ) : activeTab === "Orders" ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <OrdersPage canteenOrders={userData.canteenOrders} />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ComplaintsPage
                    campusComplaints={userData.campusComplaints}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ... LibraryPage, OrdersPage, ComplaintsPage components follow ...

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer group ${
        active
          ? "bg-slate-900 text-white shadow-2xl shadow-slate-300 translate-x-1"
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span
        className={`transition-transform duration-300 ${
          active ? "scale-110" : "group-hover:scale-110"
        }`}
      >
        {icon}
      </span>
      <span className="hidden lg:block font-bold text-sm tracking-tight">
        {label}
      </span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}
