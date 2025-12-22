import React from 'react';
import { Search, Bell, User, Circle, CheckCircle2, Download } from 'lucide-react';

// --- COMPONENT: TOP DISPLAY BAR ---
const SearchBar = () => (
  <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between bg-white shadow-sm">
    <div className="flex items-center flex-1 max-w-xl border border-gray-200 rounded px-3 py-2 bg-gray-50">
      <Search size={18} className="text-gray-400 mr-2" />
      <input 
        type="text" 
        placeholder="Search" 
        className="bg-transparent w-full outline-none text-gray-700 text-sm" 
      />
    </div>
    <div className="flex items-center gap-6 ml-4">
      <Bell size={20} className="text-gray-500 cursor-pointer hover:text-black" />
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50">
           <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-gray-600" />
        </div>
      </div>
    </div>
  </div>
);

// --- COMPONENT: SIDEBAR DISPLAY ---
const Sidebar = () => (
  <aside className="w-72 border border-gray-300 rounded-lg p-8 flex flex-col items-center bg-white shadow-sm">
    <div className="w-32 h-32 rounded-full border-2 border-gray-200 mb-6 flex items-center justify-center bg-gray-50">
      <User size={80} strokeWidth={1} className="text-gray-300" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">John Doe</h2>
    <p className="text-gray-400 font-medium">STUDENT</p>
    <p className="text-gray-400 font-small">St.xavier's College, Burdwn</p>
    <p className="text-gray-400 font-small mb-12">Roll: 123</p>
    
    <nav className="w-full space-y-6 text-gray-600">
      <div className="flex items-center gap-4 cursor-pointer hover:text-blue-600 group">
        <Circle size={20} className="text-gray-400 group-hover:text-blue-600" /> 
        <span className="font-semibold">Current Issues</span>
      </div>
      <div className="flex items-center gap-4 cursor-pointer hover:text-blue-600 group">
        <Circle size={20} className="text-gray-400 group-hover:text-blue-600" /> 
        <span className="font-semibold">Previous Issues</span>
      </div>
    </nav>
  </aside>
);

// --- COMPONENT: MAIN ISSUES DISPLAY ---
const MainContent = () => {
  const previousIssues = [1, 2, 3, 4, 5, 6];

  return (
    <main className="flex-1 border border-gray-300 rounded-lg p-6 bg-white shadow-sm overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Issues</h1>

      {/* CURRENT ISSUE BOX */}
      <div className="border border-gray-200 rounded-xl p-5 flex gap-6 bg-gray-50 mb-8">
        <div className="w-48 h-32 border border-gray-300 rounded flex items-center justify-center bg-white">
          {/* Placeholder Icon */}
          <div className="w-12 h-10 border border-gray-200 relative">
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-gray-200" />
            <div className="absolute bottom-0 w-full h-1/2 border-t border-gray-200" />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Current Issue</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">FRONTIERS</h2>
            <p className="text-xs text-gray-500 mt-1">Publication Date: Nov 2023</p>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 h-1.5 rounded-full">
              <div className="bg-blue-600 h-full rounded-full w-[65%]" />
            </div>
            <div className="flex justify-between items-center mt-2">
              <button className="bg-blue-700 text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-blue-800">
                Resume Reading
              </button>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Reading Progress: 65%</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-400 mb-4 tracking-widest uppercase">Previous Issues</h2>

      {/* PREVIOUS ISSUES GRID */}
      <div className="grid grid-cols-3 gap-4">
        {previousIssues.map((id) => (
          <div key={id} className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-400 transition-all">
            <div className="flex justify-center mb-3 relative">
               <div className="w-20 h-24 border border-gray-200 rounded bg-gray-50 shadow-inner" />
               <CheckCircle2 className="absolute top-0 right-0 text-white-400 bg-green-500" size={18} />
            </div>
            <p className="text-[10px] font-bold text-gray-700 text-center mb-3">ISSUE #{id}: Door Break</p>
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <button className="text-[9px] font-bold text-gray-500 hover:text-black uppercase underline">Read Again</button>
              <button className="text-[9px] font-bold text-gray-500 hover:text-black uppercase underline flex items-center gap-1">
                 Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

// --- THE DISPLAY WINDOW (APP) ---
export default function App() {
  return (
    <div className="h-screen w-screen bg-gray-100 p-6 flex flex-col gap-6 font-sans overflow-hidden">
      {/* Search Display Component */}
      <SearchBar />

      {/* Body Area */}
      <div className="flex flex-1 gap-6 min-h-0">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}