import React, { useState } from 'react';
import { 
  Search, Package, MapPin, Calendar, 
  Camera, CheckCircle2, AlertCircle, Sparkles,
  Filter, Tag, ArrowRight
} from "lucide-react";

export function LostAndFoundManager() {
  const [activeTab, setActiveTab] = useState('found');

  const foundItems = [
    { 
      id: "LF-102", 
      item: "Blue Dell Laptop Bag", 
      location: "Room 402, Block B", 
      date: "Oct 24, 2023", 
      status: "Unclaimed",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80",
      aiMatch: true 
    },
    { 
      id: "LF-103", 
      item: "Stainless Steel Water Bottle", 
      location: "College Gym", 
      date: "Oct 23, 2023", 
      status: "Unclaimed",
      image: "https://images.unsplash.com/photo-1602143399827-bd9596a62f77?auto=format&fit=crop&w=150&q=80",
      aiMatch: false 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Lost & Found Vault</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and match lost belongings using AI Vision.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <Camera size={18} /> New Entry
          </button>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="bg-blue-700 p-4 rounded-2xl text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-sm font-bold">Smart Match Detected</p>
            <p className="text-xs opacity-80 font-medium">A "Lost" report for a Blue Bag matches a newly "Found" item in Block B.</p>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition shadow-sm">
          Review Match
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end border-b border-gray-100 pb-2">
        <div className="flex gap-8">
          {['Found Items', 'Lost Reports', 'Handed Over'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.split(' ')[0].toLowerCase())}
              className={`pb-3 text-sm font-bold transition-all relative ${activeTab === tab.split(' ')[0].toLowerCase() ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
              {activeTab === tab.split(' ')[0].toLowerCase() && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input type="text" placeholder="Search item tag..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-48" />
           </div>
           <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition"><Filter size={18} className="text-gray-500" /></button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {foundItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
              <img src={item.image} alt={item.item} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-700 shadow-sm">
                  {item.id}
                </span>
                {item.aiMatch && (
                  <span className="bg-yellow-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-900 shadow-sm flex items-center gap-1">
                    <Sparkles size={10} /> AI Suggests Match
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">{item.item}</h3>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <MapPin size={14} className="text-blue-500" />
                  <span className="text-xs font-semibold">{item.location}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-y border-gray-50">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <CheckCircle2 size={12} /> {item.status}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition">
                  Confirm Ownership
                </button>
                <button className="p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <ArrowRight size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Placeholder Card */}
        <div className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer group">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Package size={32} className="text-gray-300" />
           </div>
           <p className="font-bold text-gray-600">Add Found Item</p>
           <p className="text-xs text-gray-400 mt-1 leading-relaxed px-4">Take a photo of the found object to let AI categorize and search for matches.</p>
        </div>
      </div>
    </div>
  );
}