import React from 'react';
import { 
  BookOpen, Users, Clock, Search, 
  ArrowUpRight, AlertCircle, Bookmark, CheckCircle2 
} from "lucide-react";

export function LibraryManager() {
  const overdueBooks = [
    { id: "B-901", title: "Data Structures", student: "Mark A.", days: 3, fine: 60 },
    { id: "B-742", title: "Modern Physics", student: "Sara J.", days: 1, fine: 20 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Library Authority</h2>
          <p className="text-gray-500 text-sm font-medium">Monitoring circulation and study space capacity.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ISBN or Student..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* --- UPPER STATS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Occupancy Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">
              <ArrowUpRight size={14} /> 12% vs yesterday
            </span>
          </div>
          <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Live Occupancy</h4>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-3xl font-black text-gray-900">152</p>
            <p className="text-gray-400 font-medium mb-1">/ 200 Seats</p>
          </div>
          <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[76%] transition-all duration-1000"></div>
          </div>
        </div>

        {/* Active Issues Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-4 group-hover:rotate-12 transition-transform">
            <BookOpen size={24} />
          </div>
          <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Books in Circulation</h4>
          <p className="text-3xl font-black text-gray-900 mt-1">1,402</p>
          <p className="text-xs text-purple-600 font-bold mt-2 underline cursor-pointer">View full catalogue →</p>
        </div>

        {/* AI Insight Card */}
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden shadow-indigo-200">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            <AlertCircle size={18} /> Peak Time Alert
          </h4>
          <p className="text-sm opacity-90 leading-relaxed">
            AI predicts 100% occupancy at 2:00 PM today due to upcoming Mid-Terms. Open the Annex Room?
          </p>
          <button className="mt-4 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
            Activate Annex
          </button>
        </div>
      </div>

      {/* --- MIDDLE SECTION: TWO COLUMN --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Circulation Feed */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Recent Activity
            </h3>
            <button className="text-xs font-bold text-blue-600">HISTORY</button>
          </div>
          <div className="divide-y divide-gray-50 px-6">
            {[
              { title: "Clean Code", user: "Aryan K.", type: "Returned", time: "2m ago" },
              { title: "Atomic Habits", user: "Lisha P.", type: "Issued", time: "15m ago" },
              { title: "Rich Dad Poor Dad", user: "Vikram R.", type: "Returned", time: "1h ago" },
            ].map((log, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${log.type === 'Issued' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                    <Bookmark size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{log.title}</p>
                    <p className="text-xs text-gray-400">{log.user} • {log.time}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${log.type === 'Issued' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                  {log.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" /> Overdue Management
          </h3>
          <div className="space-y-4">
            {overdueBooks.map((book) => (
              <div key={book.id} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex justify-between items-center group hover:bg-red-50 transition-colors">
                <div>
                  <h4 className="font-bold text-red-900">{book.title}</h4>
                  <p className="text-xs text-red-700 font-medium">Borrower: {book.student} • <span className="underline">{book.days} days late</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-red-600">₹{book.fine}</p>
                  <button className="text-[10px] font-bold text-white bg-red-600 px-3 py-1 rounded-lg mt-1 hover:bg-red-700 transition shadow-sm">
                    NOTIFY
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={32} className="text-gray-200 mb-2" />
            <p className="text-sm text-gray-500 font-medium">Scan QR on book cover to <br/>process quick return.</p>
          </div>
        </div>

      </div>
    </div>
  );
}