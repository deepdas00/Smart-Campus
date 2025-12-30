import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ChevronRight,
  XCircle,
  ArrowUpRight,
  Search,
  Filter,
  FileText,
  Tag,
  Plus,
  Activity,
  Calendar,
  HelpCircle,
  AlertCircle,
  Info,
  ExternalLink,
  TrendingUp,
  Inbox,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

export default function ReportHistory() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
const [selectedReport, setSelectedReport] = useState(null);


  
  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/reports/getMyReports`, {
        withCredentials: true,
      });

      console.log(res);

      setReports(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    submitted: {
      label: "Submitted",
      icon: <Clock className="w-4 h-4" />,
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    viewed: {
      label: "Viewed",
      icon: <ShieldAlert className="w-4 h-4" />,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    in_progress: {
      label: "In Progress",
      icon: <Clock className="w-4 h-4" />,
      className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    resolved: {
      label: "Resolved",
      icon: <ShieldCheck className="w-4 h-4" />,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle className="w-4 h-4" />,
      className: "bg-red-50 text-red-700 border-red-200",
    },
    closed: {
      label: "Closed",
      icon: <ShieldCheck className="w-4 h-4" />,
      className: "bg-slate-50 text-slate-700 border-slate-200",
    },
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || r.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );

  // 1. Calculate Dynamic Stats
  const totalReports = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const pendingCount = reports.filter(
    (r) => r.status === "submitted" || r.status === "in_progress"
  ).length;

  // Calculate Success Rate: (Resolved / Total) * 100
  const successRate =
    totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  const stats = [
    {
      label: "Total Cases",
      val: totalReports,
      icon: Inbox,
      color: "bg-indigo-600",
    },
    {
      label: "Resolved",
      val: resolvedCount,
      icon: ShieldCheck,
      color: "bg-emerald-500",
    },
    {
      label: "Pending",
      val: pendingCount,
      icon: Clock,
      color: "bg-orange-400",
    },
    {
      label: "Success Rate",
      val: `${successRate}%`,
      icon: TrendingUp,
      color: "bg-violet-500",
    },
  ];






const categoryFieldConfig = {
  researchandlab: {
    fields: [
      { key: "building", label: "Building" },
      { key: "room", label: "Room" },
      { key: "zone", label: "Zone" },
    ],
  },
  housinganddorms: {
    fields: [
      { key: "building", label: "Building" },
      { key: "room", label: "Room" },
    ],
  },
  groundandpublic: {
    fields: [
      { key: "zone", label: "Zone" },
    ],
  },
};




  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* --- TOP ANALYTICS BAR (Now Fully Dynamic) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 p-5 rounded-[2rem] flex items-center gap-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div
                className={`${stat.color} p-3 rounded-2xl text-white group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-slate-900">
                    {stat.val}
                  </p>
                  {/* Subtle trend indicator for Success Rate */}
                  {stat.label === "Success Rate" && totalReports > 0 && (
                    <span className="text-[10px] font-bold text-emerald-500">
                      +{(successRate / 10).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* --- LEFT: MAIN LIST AREA --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Case Records
                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-lg">
                      {filteredReports.length}
                    </span>
                  </h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">
                    Manage and track your active submissions
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all w-full md:w-64"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-white hover:border-indigo-200 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-6 w-fit">
                {["all", "submitted", "in_progress", "resolved"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                      activeFilter === tab
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="space-y-4">
  {reports.map((report) => {
  const status = statusConfig[report.status];

  const categoryLabel = {
    researchandlab: "Research & Lab",
    housinganddorms: "Housing & Dorms",
    groundandpublic: "Ground & Public",
  }[report.category] || report.category;

  return (
    <div
      key={report._id}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition hover:shadow-md"
    >
      <button
        onClick={() => setSelectedReport(report)}
        className="w-full p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
      >
        <div>
          <h3 className="font-bold text-lg text-slate-900">
            {report.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {categoryLabel} • Priority:{" "}
            <span className="font-semibold capitalize">
              {report.priority}
            </span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Submitted on {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${status.className}`}
        >
          {status.icon}
          {status.label}
        </div>
      </button>
    </div>
  );
})}




</div>

            </div>
          </div>

          {/* --- RIGHT: SIDEBAR WIDGETS --- */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Call to Action Widget */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl shadow-indigo-200">
              <div className="relative z-10">
                <Link to={"/report"}>
                  <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Plus className="w-6 h-6" />
                  </div>
                </Link>
                <h3 className="text-xl font-black leading-tight mb-2">
                  Need to report <br />
                  something new?
                </h3>
                <p className="text-indigo-100 text-xs font-medium mb-6 leading-relaxed">
                  Your voice matters. Submit a new case and our team will review
                  it immediately.
                </p>
                <Link to={"/report"}>
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10">
                    Create New Case
                  </button>
                </Link>
              </div>
              <Activity className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Support Widget */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">
                  Support Center
                </h4>
              </div>

              <div className="space-y-4">
                {[
                  { t: "Guidance on Evidence", i: Info },
                  { t: "Whistleblower Rights", i: ShieldCheck },
                  { t: "Contact Investigator", i: ExternalLink },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.i className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">
                        {item.t}
                      </span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Shield Info */}
            <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl flex gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">
                  End-to-End Encrypted
                </h5>
                <p className="text-[10px] text-emerald-700 font-medium mt-1 leading-relaxed">
                  Your identity and report data are secured with AES-256
                  encryption. Only authorized investigators can access your
                  data.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>




<AnimatePresence>
  {selectedReport && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedReport(null)} // Close on backdrop click
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
        className="w-full max-w-xl bg-[#F8FAFC] h-full shadow-2xl flex flex-col"
      >
        {/* --- STICKY HEADER --- */}
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                  selectedReport.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {selectedReport.priority || 'Normal'} Priority
                </span>
                <span className="text-[10px] font-bold text-slate-400">ID: #{selectedReport.transactionCode}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {selectedReport.title}
              </h2>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Stats Row */}
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {new Date(selectedReport.createdAt).toLocaleDateString()}
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Tag className="w-4 h-4 text-indigo-500" />
                {selectedReport.category}
             </div>
          </div>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Timeline Tracker (Visual Engagement) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Case Lifecycle
            </h3>
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-0" />
              <div 
                className="absolute top-4 left-0 h-0.5 bg-indigo-500 transition-all duration-1000 -z-0" 
                style={{ width: selectedReport.status === 'resolved' ? '100%' : '50%' }}
              />
              
              {['Submitted', 'Processing', 'Resolved'].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                    (i === 0) || (i === 1 && selectedReport.status !== 'submitted') || (i === 2 && selectedReport.status === 'resolved')
                    ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
             {categoryFieldConfig[selectedReport.category]?.fields.map(({ key, label }) => 
                selectedReport[key] ? (
                  <div key={key} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-900">{selectedReport[key]}</p>
                  </div>
                ) : null
             )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Initial Statement</h3>
            <div className="relative">
               <span className="absolute -top-2 -left-2 text-4xl text-indigo-100 font-serif">“</span>
               <p className="text-slate-700 leading-relaxed text-sm relative z-10 pl-2">
                 {selectedReport.description}
               </p>
            </div>
          </div>

          {/* Evidence / Attachments */}
          {selectedReport.image && (
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <FileText className="w-4 h-4" /> Visual Evidence
              </h3>
              <div className="group relative rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                 <img
                    src={selectedReport.image}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Evidence"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/30 flex items-center gap-2 hover:bg-white/40 transition-all">
                       <Search className="w-4 h-4" /> View Full Size
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* --- ACTIONS FOOTER --- */}
        <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
           <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" /> Download Report
           </button>
           <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
              Print
           </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>




      <Footer />
    </div>
  );
}
