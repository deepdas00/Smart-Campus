import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
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
  const [rating, setRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const submitRating = async (value) => {
    if (!selectedReport) return;

    try {
      setSubmittingRating(true);
      setRating(value);

      const res = await axios.post(
        `${API_URL}/api/v1/reports/${selectedReport._id}/rate`,
        { rating: value },
        { withCredentials: true }
      );

      // Update selected report immediately
      setSelectedReport(res.data.data);

      // Update list without refetch
      setReports((prev) =>
        prev.map((r) => (r._id === selectedReport._id ? res.data.data : r))
      );
    } catch (err) {
      console.error("Rating failed", err);
    } finally {
      setSubmittingRating(false);
    }
  };

  const submitRatinghandle = async (reportId, star) => {
    try {
      setSubmittingRating(true);
      setRating(star);

      const res = await axios.post(
        `${API_URL}/api/v1/reports/${reportId}/rate`,
        { rating: star },
        { withCredentials: true }
      );

      fetchMyReports();

      // Update selected report immediately
      // setSelectedReport(res.data.data);

      // Update list without refetch
    } catch (err) {
      console.error("Rating failed", err);
    } finally {
      setSubmittingRating(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/reports/getMyReports`, {
        withCredentials: true,
      });

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

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "resolved"
        ? r.status === "resolved" || r.status === "closed"
        : r.status === activeFilter);

    return matchesSearch && matchesFilter;
  });

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );

  // ["submitted", "viewed", "in_progress", "resolved", "rejected", "closed"],

  // 1. Calculate Dynamic Stats
  const totalReports = reports.length;
  const closed = reports.filter((r) => r.status === "closed").length;

  const resolvedCount =
    reports.filter((r) => r.status === "resolved").length + closed;
  const rejectCount = reports.filter((r) => r.status === "rejected").length;
  const inProgress = reports.filter((r) => r.status === "in_progress").length;

  const pendingCount = reports.filter(
    (r) => r.status === "submitted" || r.status === "in_progress"
  ).length;

  const unresolvedCount = totalReports - resolvedCount - rejectCount;
  const resolutionRate =
    totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  // The Raw Count (How many total)
  const feedbackCount = closed;

  // The Engagement Score (How well you are doing)

  const feedbackRate =
    resolvedCount > 0 ? Math.round((closed / resolvedCount) * 100) : 0;

  const rejectionRate =
    totalReports > 0 ? Math.round((rejectCount / totalReports) * 100) : 0;

  // Calculate Success Rate: (Resolved / Total) * 100
  const successRate =
    totalReports > 0 ? Math.round((resolvedCount / totalReports) * 100) : 0;

  const stats = [
    {
      label: "Total Reports",
      val: totalReports,
      icon: Inbox,
      color: "bg-indigo-600",
      hint: "All cases you have submitted",
    },
    {
      label: "Resolved",
      val: resolvedCount,
      icon: ShieldCheck,
      color: "bg-emerald-500",
      hint: "Issues successfully fixed",
    },
    {
      label: "Pending",
      val: unresolvedCount,
      icon: Clock,
      color: "bg-orange-400",
      hint: "Waiting for action",
    },
    {
      label: "Rated & Closed",
      val: closed,
      icon: TrendingUp,
      color: "bg-violet-500",
      hint: "Resolved cases you rated",
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
      fields: [{ key: "zone", label: "Zone" }],
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* --- TOP ANALYTICS BAR (Now Fully Dynamic) --- */}
        {/* --- TOP ANALYTICS DASHBOARD --- */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                System Insights
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Real-time performance of your submissions
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400">
                LIVE DATA
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 1. Resolution Health (Circular Progress) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-6 flex items-center gap-8 relative overflow-hidden"
            >
              <div className="relative flex-shrink-0">
                {/* Simple SVG Circle Progress */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{
                      strokeDashoffset: 364.4 - (364.4 * resolutionRate) / 100,
                    }}
                    className="text-indigo-600"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">
                    {resolutionRate}%
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter text-center leading-none">
                    Resolution
                    <br />
                    Score
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                    Efficiency
                  </span>
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  {resolutionRate >= 70
                    ? "Excellent Progress"
                    : resolutionRate >= 40
                    ? "Steady Growth"
                    : "Monitoring Phase"}
                </h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {resolvedCount} out of {totalReports} cases resolved. Your
                  feedback completion is at{" "}
                  <span className="text-indigo-600 font-bold">
                    {feedbackRate}%
                  </span>
                  .
                </p>

                {/* Progress bar for feedback */}
                <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feedbackRate}%` }}
                    className="h-full bg-violet-500"
                  />
                </div>
              </div>

              {/* Decorative background element */}
              <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-50 opacity-[0.03]" />
            </motion.div>

            {/* 2. Volume Breakdown */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">
                Volume Analysis
              </p>
              <div className="space-y-4">
                {[
                  {
                    label: "Active",
                    val: unresolvedCount,
                    color: "bg-orange-400",
                    total: totalReports,
                  },
                  {
                    label: "Resolved",
                    val: resolvedCount,
                    color: "bg-emerald-500",
                    total: totalReports,
                  },
                  {
                    label: "Rejected",
                    val: rejectCount,
                    color: "bg-red-400",
                    total: totalReports,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-end text-[11px] font-bold uppercase tracking-tight">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.val} Cases</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(item.val / totalReports) * 100}%`,
                        }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Quick Summary Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden group">
              <div className="relative z-0 h-full flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10 group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                    Status Summary
                  </p>
                  <h3 className="text-lg font-bold leading-tight italic">
                    "Your impact is making the campus safer."
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Contributions</span>
                    <span className="font-black text-2xl">{totalReports}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] -z-0" />
            </div>
          </div>
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
                {[
                  "all",
                  "submitted",
                  "in_progress",
                  "resolved",
                  "rejected",
                ].map((tab) => (
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
              <div className="space-y-3">
                {filteredReports.map((report) => {
                  const status = statusConfig[report.status];
                  const categoryLabel =
                    {
                      researchandlab: "Research & Lab",
                      housinganddorms: "Housing & Dorms",
                      groundandpublic: "Ground & Public",
                    }[report.category] || report.category;

                  // Mapping priority to professional border colors
                  const priorityClasses =
                    {
                      urgent: "border-l-red-500",
                      medium: "border-l-orange-500",
                      standard: "border-l-amber-400",
                    }[report.priority] || "border-l-slate-200";

                  return (
                    <div
                      key={report._id}
                      className={`group bg-white border border-slate-200 border-l-[6px] ${priorityClasses} rounded-2xl overflow-hidden transition-all hover:shadow-md hover:border-slate-300 cursor-pointer`}
                    >
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                        {/* LEFT: Clickable Info Section (Opens Sidebar) */}
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 text-left focus:outline-none"
                        >
                          <div className="flex items-center gap-3 mb-1.5 cursor-pointer">
                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {report.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-2 text-[12px] font-medium text-slate-500 cursor-pointer">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 ">
                              {categoryLabel}
                            </span>
                            <span className="mx-2 text-slate-300">|</span>
                            <span className="capitalize ">
                              Priority:{" "}
                              <span
                                className={
                                  report.priority === "urgent"
                                    ? "text-red-600"
                                    : "text-slate-700"
                                }
                              >
                                {report.priority}
                              </span>
                            </span>
                            <span className="mx-2 text-slate-300">|</span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(report.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </button>

                        {/* RIGHT: Status & Interactive Rating (Does NOT open Sidebar) */}
                        <div className="flex flex-wrap items-center gap-3 cursor-pointer">
                          {/* Interactive Rating: Only for 'resolved' status */}
                          {report.status === "resolved" && (
                            <div
                              onClick={(e) => e.stopPropagation()} // STOPS SIDEBAR FROM OPENING
                              className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 pr-3 rounded-xl shadow-sm"
                            >
                              <span className="pl-1 text-[9px] font-black uppercase tracking-tighter text-slate-400">
                                Rate
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    disabled={submittingRating || report.rating}
                                    onClick={(e) => {
                                      e.stopPropagation(); // DOUBLE PROTECTION
                                      submitRatinghandle(report._id, star);
                                    }}
                                    className="transition-transform hover:scale-125 active:scale-90 disabled:opacity-40"
                                  >
                                    <Star
                                      className={`w-4 h-4 transition-colors ${
                                        star <= (report.rating || rating)
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-slate-300 hover:text-amber-200"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Read-Only Feedback: For 'closed' status */}
                          {report.status === "closed" && report.rating && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl shadow-sm">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= report.rating
                                        ? "text-emerald-500 fill-emerald-500"
                                        : "text-emerald-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">
                                Verified
                              </span>
                            </div>
                          )}

                          {/* Main Status Badge */}
                          <div
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm border ${status?.className}`}
                          >
                            {status?.icon}
                            {status?.label}
                          </div>
                        </div>
                      </div>
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
              <div className="relative z-0">
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
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          selectedReport.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {selectedReport.priority || "Normal"} Priority
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        ID: #{selectedReport.transactionCode}
                      </span>
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
                    {/* Base Line */}
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-0" />

                    {/* Dynamic Progress Line */}
                    <div
                      className={`absolute top-4 left-0 h-0.5 -z-0 transition-all duration-1000 ${
                        selectedReport.status === "submitted" ||
                        selectedReport.status === "viewed"
                          ? "bg-indigo-500"
                          : selectedReport.status === "in_progress" ||
                            selectedReport.status === "processing"
                          ? "bg-emerald-500"
                          : selectedReport.status === "resolved"
                          ? "bg-emerald-500"
                          : selectedReport.status === "rejected"
                          ? "bg-red-500"
                          : selectedReport.status === "closed"
                          ? "bg-emerald-500"
                          : "bg-indigo-500"
                      }`}
                      style={{
                        width:
                          selectedReport.status === "submitted"
                            ? "21%"
                            : selectedReport.status === "viewed"
                            ? "31%"
                            : selectedReport.status === "in_progress" ||
                              selectedReport.status === "processing"
                            ? "52%"
                            : selectedReport.status === "resolved"
                            ? "83%"
                            : selectedReport.status === "closed"
                            ? "100%"
                            : selectedReport.status === "rejected"
                            ? "100%" // Submitted → Rejected
                            : "0%",
                      }}
                    />

                    {/* Steps */}
                    {selectedReport.status === "rejected"
                      ? // Rejected flow: Submitted → Rejected
                        ["Submitted", "Rejected"].map((step, i) => {
                          const isActive =
                            i === 0 ||
                            (i === 1 && selectedReport.status === "rejected");

                          const color = isActive
                            ? "bg-red-500 text-white"
                            : "bg-slate-200 text-slate-400";

                          const icon =
                            i === 0 ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            );

                          return (
                            <div
                              key={i}
                              className="relative z-10 flex flex-col items-center gap-2"
                            >
                              <div
                                className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${color}`}
                              >
                                {icon}
                              </div>
                              <span
                                className={`text-[10px] font-bold ${
                                  isActive ? "text-red-500" : "text-slate-500"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })
                      : // Normal flow: Submitted → Processing → Resolved
                        ["Submitted", "Processing", "Resolved", "closed"].map(
                          (step, i) => {
                            let isActive = false;
                            if (i === 0) isActive = true;
                            // Submitted always active
                            if (
                              i === 1 &&
                              (selectedReport.status === "in_progress" ||
                                selectedReport.status === "processing" ||
                                selectedReport.status === "resolved" ||
                                selectedReport.status === "closed") // ✅ ADD THIS
                            )
                              isActive = true;

                            if (
                              i === 2 &&
                              (selectedReport.status === "resolved" ||
                                selectedReport.status === "closed") // ✅ ADD THIS
                            )
                              isActive = true;

                            if (i === 3 && selectedReport.status === "closed")
                              isActive = true;

                            const color = isActive
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 text-slate-400";

                            return (
                              <div
                                key={i}
                                className="relative z-10 flex flex-col items-center gap-2"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${color}`}
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span
                                  className={`text-[10px] font-bold ${
                                    isActive
                                      ? "text-emerald-500"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          }
                        )}
                  </div>
                </div>

                {selectedReport.status === "resolved" && (
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                      Rate Resolution
                    </h3>

                    <p className="text-sm text-slate-600 mb-4">
                      How satisfied are you with the resolution?
                    </p>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          disabled={submittingRating}
                          onClick={() => submitRating(star)}
                          className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (selectedReport.rating || rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    {submittingRating && (
                      <p className="text-xs text-indigo-500 mt-3 font-bold">
                        Submitting feedback...
                      </p>
                    )}
                  </div>
                )}

                {selectedReport.status === "closed" &&
                  selectedReport.rating && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
                      <p className="text-sm font-bold text-emerald-700 mb-2">
                        Thanks for your feedback!
                      </p>

                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= selectedReport.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Location & Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {categoryFieldConfig[selectedReport.category]?.fields.map(
                    ({ key, label }) =>
                      selectedReport[key] ? (
                        <div
                          key={key}
                          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
                        >
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {selectedReport[key]}
                          </p>
                        </div>
                      ) : null
                  )}
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Initial Statement
                  </h3>
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 text-4xl text-indigo-100 font-serif">
                      “
                    </span>
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
