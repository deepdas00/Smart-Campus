import { useEffect, useState } from "react";
import axios from "axios";
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
  X,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
import CollegeInfo from "../Components/CollegeInfo";

export function KitchenKDS() {
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

  // Real-time clock for the HUD
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/v1/canteen/foods`,
          { withCredentials: true } // if auth cookies are used
        );

        console.log(res.data.data);

        setMenuItems(res.data.data); // adjust if response structure differs
      } catch (err) {
        setError("Failed to load food menu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const handleAddFood = async () => {
    if (
      !foodForm.name ||
      !foodForm.price ||
      !foodForm.category ||
      !foodForm.foodType
    ) {
      alert("Please fill all required fields");
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
      if (foodForm.image) {
        formData.append("image", foodForm.image); // file upload
      }

      const res = await axios.post(
        `${API_URL}/api/v1/canteen/foods`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);
      alert("Food added successfully!");
      setShowAddFood(false);
      setFoodForm({}); // reset form
      // Optionally: fetch menu items again to update the list
    } catch (err) {
      console.error(err);
      alert("Failed to add food. Check console for details.");
    } finally {
      setAddingFood(false);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      // Optimistic UI: immediately toggle in UI (optional)
      setMenuItems(
        menuItems.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m
        )
      );

      // Send PATCH request to backend
      const res = await axios.patch(
        `${API_URL}/api/v1/canteen/foods/${item._id}`,
        {
          isAvailable: !item.isAvailable,
        },
        { withCredentials: true }
      );

      console.log("Updated in DB:", res.data);

      // Optionally, refresh menu from backend:
      // fetchFoods();
    } catch (err) {
      console.error("Failed to update availability:", err);
      alert("Could not update availability. Try again.");

      // Revert UI if failed
      setMenuItems(
        menuItems.map((m) =>
          m._id === item._id ? { ...m, isAvailable: item.isAvailable } : m
        )
      );
    }
  };

  const [orders, setOrders] = useState([
    {
      id: "ORD-7712",
      student: "Rahul Verma",
      items: ["Peri Peri Fries x1", "Lime Soda x2"],
      total: "180",
      waitTime: 3,
      status: "preparing",
      priority: "high",
    },
    {
      id: "ORD-7713",
      student: "Sneha Kapur",
      items: ["Paneer Grill Sandwich x1"],
      total: "120",
      waitTime: 1,
      status: "preparing",
      priority: "normal",
    },
    {
      id: "ORD-7710",
      student: "Amit S.",
      items: ["Veg Burger Combo"],
      total: "210",
      waitTime: 12,
      status: "ready",
      priority: "normal",
    },
  ]);

  const markAsReady = (id) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: "ready" } : o)));
  };

  const handleAddOrEditFood = async () => {
    if (
      !foodForm.name ||
      !foodForm.price ||
      !foodForm.category ||
      !foodForm.foodType
    ) {
      alert("Please fill all required fields");
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
        alert("Food updated successfully!");
      } else {
        // Add new
        res = await axios.post(`${API_URL}/api/v1/canteen/foods`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMenuItems([...menuItems, res.data.data]);
        alert("Food added successfully!");
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
      alert("Failed to save food.");
    } finally {
      setAddingFood(false);
    }
  };

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
                  <span className="flex items-center gap-1.5 text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>{" "}
                    Online
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
                  <p className="text-lg font-black text-slate-800">8.2m</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto">
          {/* --- NEW: ENGAGING MENU MANAGEMENT SECTION --- */}
          <section className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <Package className="text-blue-600" /> Live Menu Feed
                </h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                  Manage your active listings
                </p>
              </div>

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
                  <p className="text-3xl font-black text-emerald-700">92%</p>
                </div>
              </div>

              {/* SCROLLABLE FOOD LIST */}
              <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest ">
                          Dish Image
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Dish Name
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Category
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Price
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Quantity
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                          Available
                        </th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
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
                          <td className="px-8 py-5 font-bold text-slate-800">
                            {item.name}
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 font-black text-slate-900">
                            ₹{item.price}
                          </td>
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
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                                  item.quantityAvailable <= 0
                                    ? "bg-gray-400"
                                    : item.isAvailable
                                    ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                                    : "bg-slate-200"
                                }
        ${
          item.quantityAvailable === 0
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                    item.isAvailable
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-[10px] font-black uppercase tracking-widest ${
                                  item.quantityAvailable <= 0
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

                              <button className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
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
                  className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-105"
                      : "text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {tab}{" "}
                  {activeTab === tab &&
                    `(${
                      orders.filter(
                        (o) =>
                          o.status ===
                          (tab === "pending" ? "preparing" : "ready")
                      ).length
                    })`}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs mr-4 hover:text-slate-600">
              <Printer size={16} /> Auto-Print: ON
            </button>
          </div>

          {/* --- ENHANCED TICKET GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {orders
              .filter(
                (o) =>
                  o.status === (activeTab === "pending" ? "preparing" : "ready")
              )
              .map((order) => (
                <div
                  key={order.id}
                  className={`group bg-white rounded-[3rem] border-2 transition-all duration-500 flex flex-col relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                    order.priority === "high"
                      ? "border-orange-100 shadow-orange-900/5"
                      : "border-transparent shadow-slate-900/5"
                  }`}
                >
                  {/* Progress Indicator */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        order.waitTime > 10 ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(order.waitTime * 10, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="p-8 pt-10 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                          Ticket #{order.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-400 mt-1 italic">
                          {order.student}
                        </h4>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 font-black text-[10px] uppercase px-3 py-1 rounded-full ${
                          order.waitTime > 5
                            ? "bg-red-50 text-red-500 animate-pulse"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Clock size={12} /> {order.waitTime}m ago
                      </div>
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

                    <div className="pt-6 border-t border-dashed border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase">
                          Paid Total
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{order.total}
                        </p>
                      </div>
                      {order.priority === "high" && (
                        <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                          <AlertCircle size={20} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/*QR MODEL */}

                  <div className="p-5 bg-slate-50/50 backdrop-blur-sm">
                    {order.status === "preparing" ? (
                      <button
                        onClick={() => markAsReady(order.id)}
                        className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                      >
                        <Play size={16} fill="currentColor" /> Dispatch to
                        Counter
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200"
                      >
                        <QrCode size={18} /> Verify & Deliver
                      </button>
                    )}
                  </div>
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
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 w-10xl " >
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
                      Image
                    </th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">
                      Dish
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

                      <td className="px-8 py-5 font-bold">{item.name}</td>
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                              item.quantityAvailable <= 0
                                ? "bg-gray-400"
                                : item.isAvailable
                                ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                                : "bg-slate-200"
                            }
        ${
          item.quantityAvailable === 0
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                item.isAvailable
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${
                              item.quantityAvailable <= 0
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

                          <button className="p-2 hover:bg-red-50 text-red-500 rounded-xl">
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

      {/*Add food */}
      {showAddFood && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Food</h2>
              <button onClick={() => setShowAddFood(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Food Name"
                value={foodForm.name}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, name: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Price"
                value={foodForm.price}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, price: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Quantity Available"
                value={foodForm.quantityAvailable}
                onChange={(e) =>
                  setFoodForm({
                    ...foodForm,
                    quantityAvailable: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <select
                value={foodForm.category}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, category: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="snack">Snacks</option>
                <option value="meal">Meal</option>
                <option value="drink">Drink</option>
                <option value="sweet">Sweet</option>
              </select>

              <select
                value={foodForm.foodType}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, foodType: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>

              <textarea
                placeholder="Description"
                value={foodForm.description}
                onChange={(e) =>
                  setFoodForm({ ...foodForm, description: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              {/* New Image Upload */}
              <div>
                <label className="block text-sm font-bold mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFoodForm({ ...foodForm, image: e.target.files[0] })
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />
                {foodForm.image && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {foodForm.image.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleAddOrEditFood}
                disabled={addingFood}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                {addingFood
                  ? "Saving..."
                  : editingFood
                  ? "Update Food"
                  : "Add Food"}
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
