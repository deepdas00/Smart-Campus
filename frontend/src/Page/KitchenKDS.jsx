import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, QrCode, Utensils, 
  AlertCircle, ChevronRight, XCircle, Shield,
  Printer, Play, Zap, LogOut, Flame, TrendingUp
} from "lucide-react";
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer';

export function KitchenKDS() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock for the HUD
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [orders, setOrders] = useState([
    { id: "ORD-7712", student: "Rahul Verma", items: ["Peri Peri Fries x1", "Lime Soda x2"], total: "180", waitTime: 3, status: "preparing", priority: "high" },
    { id: "ORD-7713", student: "Sneha Kapur", items: ["Paneer Grill Sandwich x1"], total: "120", waitTime: 1, status: "preparing", priority: "normal" },
    { id: "ORD-7710", student: "Amit S.", items: ["Veg Burger Combo"], total: "210", waitTime: 12, status: "ready", priority: "normal" },
  ]);

  const markAsReady = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'ready' } : o));
  };

  return (
    <>
    {/*Navbar */}

    <Navbar/>

    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900 ">
      
      {/* --- ENGAGING SMART HUD --- */}
      <div className="max-w-7xl mx-auto mb-10 mt-15">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-3xl shadow-xl text-white">
                    <Utensils size={32} />
                </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Kitchen Command</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div> Online
                </span>
                <p className="text-sm font-bold text-slate-400">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Rush Mode</p>
                    <p className="text-lg font-black text-slate-800">High</p>
                </div>
            </div>
            <div className="flex-1 lg:flex-none bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-2xl">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Prep</p>
                    <p className="text-lg font-black text-slate-800">8.2m</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        
        {/* --- DYNAMIC FILTER BAR --- */}
        <div className="flex items-center justify-between mb-8 bg-white/50 p-2 rounded-[2rem] border border-slate-200/60 backdrop-blur-md">
          <div className="flex gap-2">
            {['pending', 'ready'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                  activeTab === tab 
                  ? "bg-slate-900 text-white shadow-2xl shadow-slate-200 scale-105" 
                  : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {tab} {activeTab === tab && `(${orders.filter(o => o.status === (tab === 'pending' ? 'preparing' : 'ready')).length})`}
              </button>
            ))}
          </div>
          <button className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-xs mr-4 hover:text-slate-600">
            <Printer size={16} /> Auto-Print: ON
          </button>
        </div>

        {/* --- ENHANCED TICKET GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.filter(o => o.status === (activeTab === 'pending' ? 'preparing' : 'ready')).map((order) => (
            <div 
              key={order.id} 
              className={`group bg-white rounded-[3rem] border-2 transition-all duration-500 flex flex-col relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                order.priority === 'high' ? 'border-orange-100 shadow-orange-900/5' : 'border-transparent shadow-slate-900/5'
              }`}
            >
              
              {/* Progress Indicator */}
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                <div 
                  className={`h-full transition-all duration-1000 ${order.waitTime > 10 ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${Math.min(order.waitTime * 10, 100)}%` }}
                ></div>
              </div>

              <div className="p-8 pt-10 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                      Ticket #{order.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-400 mt-1 italic">{order.student}</h4>
                  </div>
                  <div className={`flex items-center gap-1.5 font-black text-[10px] uppercase px-3 py-1 rounded-full ${order.waitTime > 5 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock size={12} /> {order.waitTime}m ago
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <p className="text-xl font-bold text-slate-800 tracking-tight">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-dashed border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase">Paid Total</p>
                        <p className="text-2xl font-black text-slate-900">₹{order.total}</p>
                    </div>
                    {order.priority === 'high' && (
                        <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                            <AlertCircle size={20} />
                        </div>
                    )}
                </div>
              </div>

              <div className="p-5 bg-slate-50/50 backdrop-blur-sm">
                {order.status === 'preparing' ? (
                  <button 
                    onClick={() => markAsReady(order.id)}
                    className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                  >
                    <Play size={16} fill="currentColor" /> Dispatch to Counter
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
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Ready for Pickup</h3>
              <p className="text-slate-500 font-bold">Scanning identifies student <span className="text-blue-600">{selectedOrder.student}</span></p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white border-8 border-slate-50 p-8 rounded-[3rem] inline-block shadow-inner">
                <QrCode size={180} className="text-slate-900" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 grid grid-cols-2 gap-4">
                <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Order ID</p>
                    <p className="font-bold text-slate-900">{selectedOrder.id}</p>
                </div>
                <div className="text-left border-l border-slate-200 pl-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                    <p className="font-bold text-emerald-500">Payment Verified</p>
                </div>
            </div>

            <button 
              onClick={() => {
                setOrders(orders.filter(o => o.id !== selectedOrder.id));
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


    {/* Footer */}
      <Footer/>
    </>
  );
}