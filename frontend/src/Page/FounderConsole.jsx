import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Building2, Users, CreditCard, Search, Plus, 
  MoreVertical, ArrowUpRight, Globe, Database, ShieldCheck, 
  Activity, Zap, TrendingUp, DollarSign, Terminal, Cpu, 
  ArrowRight, CheckCircle2, CloudLightning
} from "lucide-react";
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer';

export default function FounderConsole() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'campuses': return <CampusesTab />;
      case 'billing': return <BillingTab />;
      case 'infra': return <InfraTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <Navbar />
      
      {/* --- ELITE NAVIGATION BAR --- */}
      <div className="pt-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-8 h-full">
            <div className="flex items-center gap-2 pr-6 border-r border-slate-100">
              <div className="bg-slate-900 p-1.5 rounded-lg text-white shadow-lg shadow-slate-200">
                <ShieldCheck size={18} />
              </div>
              <span className="font-black uppercase tracking-tighter text-sm italic">Founder<span className="text-blue-600">HQ</span></span>
            </div>
            
            <nav className="flex gap-2 h-full">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Insight" icon={<LayoutDashboard size={15}/>} />
              <TabButton active={activeTab === 'campuses'} onClick={() => setActiveTab('campuses')} label="Nodes" icon={<Building2 size={15}/>} />
              <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} label="Capital" icon={<CreditCard size={15}/>} />
              <TabButton active={activeTab === 'infra'} onClick={() => setActiveTab('infra')} label="Cores" icon={<Database size={15}/>} />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">● System Live</span>
              <span className="text-[10px] font-bold text-slate-400">v4.2.0-Stable</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg flex items-center justify-center text-white font-black text-xs">JD</div>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-8 py-10">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

// --- TAB: OVERVIEW (With Animated Growth Graph) ---
function OverviewTab() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Section with Counter Animation Logic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Revenue (ARR)" value="₹12.4" suffix="Cr" change="+14.2%" icon={<TrendingUp />} color="blue" />
        <KPICard title="Live Campus Nodes" value="142" suffix="" change="+12" icon={<Globe />} color="emerald" />
        <KPICard title="Managed Students" value="842" suffix="K" change="+18%" icon={<Users />} color="indigo" />
        <KPICard title="Resource Cost" value="₹1.8" suffix="L" change="-4.1%" icon={<CloudLightning />} color="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* GROWTH VISUALIZER */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-center mb-12 relative z-10">
            <div>
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-1">Network Expansion</h3>
              <p className="text-2xl font-black tracking-tight">Node Scaling Velocity</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black text-blue-600">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" /> REAL-TIME
              </div>
            </div>
          </div>

          {/* CUSTOM CSS GRAPH ANIMATION */}
          <div className="flex items-end justify-between h-64 w-full gap-3 mt-4">
             {[40, 70, 45, 90, 65, 80, 50, 95, 100, 85, 92, 110].map((h, i) => (
               <div key={i} className="flex-1 group/bar relative">
                 <div 
                   className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-xl transition-all duration-1000 ease-out hover:from-blue-600 hover:to-blue-400 cursor-pointer"
                   style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                 >
                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded font-bold transition-all">
                        {h}%
                    </div>
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-4">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Dec</span>
          </div>
        </div>

        {/* OWNER TASKS */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Activity size={120} />
          </div>
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Priority Actions</h4>
          <div className="space-y-4 relative z-10">
            <TodoItem text="Audit Stanford Node Security" urgent />
            <TodoItem text="Review SaaS Tax Compliance" />
            <TodoItem text="Deploy Mumbai Cluster v2" urgent />
            <TodoItem text="Onboard Heritage Institute" />
            <TodoItem text="Update Pricing Tier Matrix" />
          </div>
          <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            View All Tasks <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TAB: BILLING (With Stat Breakdown) ---
function BillingTab() {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[40px] border border-slate-200 p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tight">Active Accounts</h3>
            <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase">3 Payments Pending</span>
          </div>
          <div className="space-y-4">
            <InvoiceCard campus="Heritage Inst." amount="₹4,50,000" due="Overdue" color="text-rose-600" />
            <InvoiceCard campus="Stanford Tech" amount="₹8,20,000" due="Due in 4d" color="text-slate-400" />
            <InvoiceCard campus="MIT Global" amount="₹12,40,000" due="Due in 15d" color="text-slate-400" />
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 p-10">
          <h3 className="text-xl font-black tracking-tight mb-8">Revenue Distribution</h3>
          <div className="space-y-8">
            <StatProgress label="Software Subscription" value="₹8.2 Cr" percent={65} color="bg-blue-600" />
            <StatProgress label="Hardware/IoT Sales" value="₹2.8 Cr" percent={25} color="bg-indigo-600" />
            <StatProgress label="Consulting & Training" value="₹1.4 Cr" percent={10} color="bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MINI COMPONENTS ---

function TabButton({ active, onClick, label, icon }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-2 px-6 h-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all border-b-2 ${
        active ? 'border-blue-600 text-blue-600 bg-blue-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function KPICard({ title, value, suffix, change, icon, color }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    indigo: "text-indigo-600 bg-indigo-50"
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl group">
      <div className={`p-3 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 duration-500 ${themes[color]}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-baseline gap-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h2>
        <span className="text-lg font-black text-slate-400">{suffix}</span>
      </div>
      <div className={`mt-4 text-[10px] font-black uppercase flex items-center gap-1 ${change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
        {change} <span className="text-slate-300 font-bold italic tracking-normal">vs prev. month</span>
      </div>
    </div>
  );
}

function TodoItem({ text, urgent }) {
  return (
    <div className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${urgent ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-slate-600'}`} />
        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{text}</span>
      </div>
      <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
    </div>
  );
}

function InvoiceCard({ campus, amount, due, color }) {
  return (
    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 group-hover:border-blue-200 transition-all">
          <FileText size={18} className="text-slate-400 group-hover:text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-800">{campus}</p>
          <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{due}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-slate-900">{amount}</p>
        <p className="text-[10px] font-bold text-blue-600 hover:underline">Download PDF</p>
      </div>
    </div>
  );
}

function StatProgress({ label, value, percent, color }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-lg font-black text-slate-800">{value}</p>
        </div>
        <span className="text-xs font-black text-slate-400">{percent}%</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// (Empty sections like CampusesTab and InfraTab remain as they were in the previous version for functionality)
function CampusesTab() { return <div className="text-slate-400 text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 italic">Node Management Layer - v4.2</div> }
function InfraTab() { return <div className="text-slate-400 text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 italic">Core Systems - Mumbai AS-SOUTH-1</div> }