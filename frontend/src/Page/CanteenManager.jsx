import axios from "axios";
import { useEffect } from "react";
import React, { useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  IndianRupee,
  ChefHat,
  AlertCircle,
  Package,
  Plus,
  Filter, // <--- Add this
  TrendingDown,
  ArrowUpRight, // <--- Add this
  MoreVertical,
  Search,
} from "lucide-react";

export function CanteenManager() {
  const [activeTab, setActiveTab] = useState("orders");

  const [selectedRange, setSelectedRange] = useState("daily"); // default daily
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [avgPrepTime, setAvgPrepTime] = useState(0);

  useEffect(() => {
    const fetchDashboardOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/canteen/orders/dashboard?range=${selectedRange}`,
          { withCredentials: true }
        );
        const data = res.data.data || [];
        setOrders(data);

        // Compute Daily Revenue
        const todayRevenue = data
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.totalAmount, 0);
        setDailyRevenue(todayRevenue);

        // Compute Active Orders
        const activeCount = data.filter(
          (o) => o.orderStatus !== "served"
        ).length;
        setActiveOrders(activeCount);

        // Compute Avg Prep Time (assuming `prepTime` in minutes is available)
        const prepTimes = data.map((o) => o.prepTime || 12); // default 12m if missing
        const avgPrep =
          prepTimes.reduce((sum, t) => sum + t, 0) / (prepTimes.length || 1);
        setAvgPrepTime(Math.round(avgPrep));
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchDashboardOrders();
  }, [selectedRange]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/canteen/foods`,
          { withCredentials: true }
        );
        console.log(res.data.data.foods);

        setFoods(res.data.data.foods || []);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();

    return (
      order.transactionCode?.toLowerCase().includes(q) ||
      order.studentId?.rollNo?.toLowerCase().includes(q)
    );
  });

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      categoryFilter === "all" || food.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Header */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ChefHat className="text-orange-500" /> Canteen Command
          </h2>
          <p className="text-gray-500 text-sm">
            Manage live orders, digital payments, and inventory.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "orders"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            Live Orders
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "inventory"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500"
            }`}
          >
            Inventory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <span className="text-sm font-medium">Daily Revenue</span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <h3 className="text-3xl font-bold">₹{dailyRevenue}</h3>
          {/* <p className="text-xs mt-2 text-blue-100">
          {orders.length ? `+${Math.round(dailyRevenue * 0.18)} from yesterday` : ""}
        </p> */}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Active Orders</span>
            <ShoppingBag className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{activeOrders}</h3>
          <p className="text-xs mt-2 text-orange-600 font-medium">
            {activeOrders > 0 ? `${activeOrders} orders delayed` : "No delays"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Avg. Prep Time</span>
            <Clock className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{avgPrepTime}m</h3>
          <p className="text-xs mt-2 text-green-600 font-medium">
            Optimized by AI
          </p>
        </div>
      </div>

      {activeTab === "orders" ? (
        <div className="grid grid-cols-1 gap-6 w-full ">
          <div className="flex flex-wrap items-center gap-10 mb-3 w-full ">
            {/* Range Buttons */}
            <div className="flex gap-2">
              {["daily", "weekly", "monthly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition
          ${
            selectedRange === range
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              {/* Search Icon */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              {/* Input */}
              <input
                type="text"
                placeholder="Search Roll No / Transaction ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 text-sm font-medium
               rounded-xl border border-gray-200 bg-white
               placeholder:text-gray-400
               shadow-sm
               transition-all
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               hover:border-gray-300"
              />

              {/* Clear Button (optional but recommended) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 hover:text-red-500 transition"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Live Order Cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />{" "}
              Incoming Queue
            </h3>
            {loadingOrders ? (
              <div className="text-sm text-gray-500">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-sm text-gray-400">
                No matching orders found
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Student Info
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        {/* Order ID & Time */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            #{order.transactionCode}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Student Info */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-800">
                            {order.studentId.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.studentId.rollNo}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {order.studentId.mobileNo}
                          </div>
                        </td>

                        {/* Items List (Detail view) */}
                        <td className="px-6 py-4">
                          <div className="max-w-[200px]">
                            {order.items.map((item, idx) => (
                              <span key={idx} className="text-xs text-gray-600">
                                {item.name} (x{item.quantity})
                                {idx !== order.items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Amount & Payment */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            ₹{order.totalAmount}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        {/* Order Status Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              order.orderStatus === "order_received"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>

                            {order.orderStatus === "order_received"
                              ? "Pending"
                              : order.orderStatus === "served"
                              ? "Served"
                              : order.orderStatus.replace(/_/g, " ")}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Print Receipt"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                              </svg>
                            </button>
                            <button className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800">
                              Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Table */}
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {[...new Set(foods.map((f) => f.category))].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl shadow-sm text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                />
                {/* <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition">
            <Plus size={18} /> Add New Item
          </button> */}
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
              {loading ? (
                <div className="p-4 text-gray-500">Loading foods...</div>
              ) : filteredFoods.length === 0 ? (
                <div className="p-4 text-gray-400">No foods found</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredFoods.map((food) => (
                      <tr
                        key={food._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="p-4 font-bold text-gray-900">
                          {food.name}
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {food.category}
                          </span>
                        </td>
                        <td className="p-4 capitalize">{food.foodType}</td>
                        <td className="p-4 font-bold">₹{food.price}</td>
                        <td className="p-4 font-mono">
                          {food.quantityAvailable}
                        </td>
                        <td className="p-4">
                          {food.isAvailable ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                              <CheckCircle size={14} /> Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg w-fit">
                              <AlertCircle size={14} /> Unavailable
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {new Date(food.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {new Date(food.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Kitchen Insight */}
      <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-4 border border-orange-100">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
        <p className="text-sm text-orange-800 font-medium leading-tight">
          <span className="font-bold">AI Insight:</span> Demand for "Cold
          Coffee" is spiking. Ensure the coffee machine is serviced and beans
          are stocked for the 1 PM rush.
        </p>
      </div>
    </div>
  );
}
