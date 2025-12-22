import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  IndianRupee, 
  ChefHat, 
  AlertCircle, 
  Package, 
  Plus, 
  Filter,       // <--- Add this
  TrendingDown, 
  ArrowUpRight,  // <--- Add this
  MoreVertical, 
  Search 
} from "lucide-react";

export function CanteenManager() {
  const [activeTab, setActiveTab] = useState('orders');
const inventoryItems = [
    { id: 1, name: "Amul Milk (1L)", category: "Dairy", stock: 12, minStock: 20, unit: "Pkt", cost: 64 },
    { id: 2, name: "Paneer Block", category: "Dairy", stock: 45, minStock: 10, unit: "kg", cost: 420 },
    { id: 3, name: "Coffee Beans", category: "Grocery", stock: 2, minStock: 5, unit: "kg", cost: 850 },
    { id: 4, name: "Vegetable Oil", category: "Grocery", stock: 15, minStock: 15, unit: "Ltr", cost: 140 },
  ];


  const liveOrders = [
    { id: "992", items: "Paneer Wrap x2", customer: "Rahul (Hostel A)", type: "Takeaway", status: "Preparing", time: "5m ago" },
    { id: "993", items: "Cold Coffee x1, Veg Burger x1", customer: "Sana (Dept. CS)", type: "Dining", status: "New", time: "1m ago" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ChefHat className="text-orange-500" /> Canteen Command
          </h2>
          <p className="text-gray-500 text-sm">Manage live orders, digital payments, and inventory.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Live Orders
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
          >
            Inventory
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <span className="text-sm font-medium">Daily Revenue</span>
            <IndianRupee className="w-4 h-4" />
          </div>
          <h3 className="text-3xl font-bold">₹12,450</h3>
          <p className="text-xs mt-2 text-blue-100">+18% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Active Orders</span>
            <ShoppingBag className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">18</h3>
          <p className="text-xs mt-2 text-orange-600 font-medium">5 orders delayed</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-gray-500 mb-2">
            <span className="text-sm font-medium">Avg. Prep Time</span>
            <Clock className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">12m</h3>
          <p className="text-xs mt-2 text-green-600 font-medium">Optimized by AI</p>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Order Cards */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Incoming Queue
            </h3>
            {liveOrders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                      {order.type}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 mt-2">#{order.id} — {order.items}</h4>
                    <p className="text-sm text-gray-500">Ordered by {order.customer}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{order.time}</span>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition">
                    Mark Ready
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Menu Management */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Quick Stock Toggle</h3>
              <button className="text-xs text-blue-600 font-bold uppercase tracking-widest">Edit Menu</button>
            </div>
            <div className="p-2">
              {[
                { name: "Paneer Wrap", stock: "High", active: true },
                { name: "Cold Coffee", stock: "Low", active: true },
                { name: "Chicken Roll", stock: "Out of Stock", active: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={`text-sm font-medium ${!item.active && 'text-gray-400'}`}>{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    item.stock === 'Out of Stock' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Inventory Controls */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>Dairy</option>
                  <option>Grocery</option>
                </select>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200">
              <Plus size={18} /> Add New Item
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Cost</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <Package size={20} />
                        </div>
                        <span className="font-bold text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm">
                      <span className={item.stock < item.minStock ? 'text-red-600 font-bold' : 'text-gray-900'}>
                        {item.stock} / {item.minStock} {item.unit}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900">₹{item.cost}</td>
                    <td className="p-4">
                      {item.stock < item.minStock ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg w-fit">
                          <AlertCircle size={14} /> Low Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                          <CheckCircle size={14} /> Healthy
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-sm">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Supply Chain Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Estimated Monthly Spend</p>
                <h4 className="text-2xl font-extrabold text-gray-900 mt-1">₹48,200</h4>
                <div className="flex items-center gap-1 text-red-500 mt-2 text-sm font-bold">
                  <ArrowUpRight size={16} /> 12% Price Hike (Dairy)
                </div>
              </div>
              <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                <TrendingDown className="text-blue-600 rotate-180" />
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
               <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Auto-Refill Active</h4>
                <p className="text-sm opacity-80 mb-4">AI will automatically create purchase orders for Low Stock items at 6:00 PM today.</p>
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition">
                  Manage Suppliers
                </button>
               </div>
               <Package className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
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
          <span className="font-bold">AI Insight:</span> Demand for "Cold Coffee" is spiking. Ensure the coffee machine is serviced and beans are stocked for the 1 PM rush.
        </p>
      </div>
    </div>
  );
}