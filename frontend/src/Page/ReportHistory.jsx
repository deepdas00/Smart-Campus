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

      <main className="max-w-7xl mx-auto px-2 py-4 sm:px-4 sm:py-8 lg:py-12">
        {/* --- TOP ANALYTICS BAR (Now Fully Dynamic) --- */}
        {/* --- TOP ANALYTICS DASHBOARD --- */}
        <div className="mb-8 md:mb-12">
          {/* HEADER */}
          <div className="flex items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
            <div className="flex justify-center items-center flex-col w-full sm:w-auto">
              <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                System Insights
              </h3>
              <p className="text-[11px] md:text-xs text-slate-500 font-medium">
                Real-time performance of your submissions
              </p>
            </div>

            {/* Desktop badge only */}
            <div className="hidden md:flex gap-2">
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400">
                LIVE DATA
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* 1. RESOLUTION HEALTH */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
        lg:col-span-2
        bg-white border border-slate-200
        rounded-[1.5rem] md:rounded-[2.5rem]
        p-4 md:p-6
        flex flex-col sm:flex-row items-center gap-4 md:gap-8
        relative overflow-hidden
      "
            >
              {/* CIRCLE */}
              <div className="relative flex-shrink-0">
                <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={263.8}
                    initial={{ strokeDashoffset: 263.8 }}
                    animate={{
                      strokeDashoffset: 263.8 - (263.8 * resolutionRate) / 100,
                    }}
                    className="text-indigo-600"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg md:text-2xl font-black text-slate-900">
                    {resolutionRate}%
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight text-center leading-none">
                    Resolution
                    <br />
                    Score
                  </span>
                </div>
              </div>

              {/* TEXT */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 mb-1 md:mb-2 justify-center sm:justify-start">
                  <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase text-slate-400 tracking-widest">
                    Efficiency
                  </span>
                </div>

                <h4 className="text-base md:text-xl font-black text-slate-900">
                  {resolutionRate >= 70
                    ? "Excellent Progress"
                    : resolutionRate >= 40
                    ? "Steady Growth"
                    : "Monitoring Phase"}
                </h4>

                <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2 leading-relaxed">
                  {resolvedCount} out of {totalReports} cases resolved. Feedback
                  at{" "}
                  <span className="text-indigo-600 font-bold">
                    {feedbackRate}%
                  </span>
                  .
                </p>

                {/* FEEDBACK BAR */}
                <div className="mt-3 md:mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${feedbackRate}%` }}
                    className="h-full bg-violet-500"
                  />
                </div>
              </div>

              <TrendingUp className="absolute -bottom-6 -right-6 w-24 h-24 text-slate-50 opacity-[0.03]" />
            </motion.div>

            {/* 2. VOLUME BREAKDOWN */}
            <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6">
              <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 md:mb-6">
                Volume Analysis
              </p>

              <div className="space-y-3 md:space-y-4">
                {[
                  {
                    label: "Active",
                    val: unresolvedCount,
                    color: "bg-orange-400",
                  },
                  {
                    label: "Resolved",
                    val: resolvedCount,
                    color: "bg-emerald-500",
                  },
                  { label: "Rejected", val: rejectCount, color: "bg-red-400" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-end text-[10px] md:text-[11px] font-bold uppercase">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900">{item.val}</span>
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

            {/* 3. QUICK SUMMARY */}
            <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 text-white relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 border border-white/10 group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                  </div>

                  <p className="text-[9px] md:text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">
                    Status Summary
                  </p>

                  <h3 className="text-sm md:text-lg font-bold italic leading-tight">
                    "Your impact is making the campus safer."
                  </h3>
                </div>

                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Contributions</span>
                    <span className="font-black text-xl md:text-2xl">
                      {totalReports}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ================= LEFT: MAIN LIST ================= */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-8">
              {/* HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8">
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-slate-900 flex items-center gap-2">
                    Case Records
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-lg">
                      {filteredReports.length}
                    </span>
                  </h2>
                  <p className="text-xs lg:text-sm text-slate-400 font-medium mt-1">
                    Manage and track your active submissions
                  </p>
                </div>

                {/* SEARCH + FILTER */}
                <div className="flex flex-row sm:flex-row gap-2 w-full lg:w-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      placeholder="Search cases..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STATUS TABS (SCROLLABLE ON MOBILE) */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto no-scrollbar">
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
                    className={`px-3 lg:px-4 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                      activeFilter === tab
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* LIST */}
              <div className="space-y-3">
                {filteredReports.map((report) => {
                  const status = statusConfig[report.status];
                  const priorityBorder =
                    {
                      urgent: "border-l-red-500",
                      medium: "border-l-orange-500",
                      standard: "border-l-amber-400",
                    }[report.priority] || "border-l-slate-200";

                  return (
                    <div
                      key={report._id}
                      className={`bg-white border border-slate-200 border-l-[5px] ${priorityBorder} rounded-xl lg:rounded-2xl transition hover:shadow-md`}
                    >
                      <div className="p-3 lg:p-4 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                        {/* INFO */}
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 text-left"
                        >
                          <h3 className="font-bold text-sm lg:text-base text-slate-900 mb-1">
                            {report.title}
                          </h3>

                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded">
                              {report.category}
                            </span>
                            <span>
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
                            <span className="flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </button>

                        {/* STATUS + RATING */}
                        <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end">
                          {report.status === "resolved" && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg"
                            >
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    submitRatinghandle(report._id, star);
                                  }}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= (report.rating || rating)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          )}

                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status?.className}`}
                          >
                            {status?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: SIDEBAR ================= */}
          <aside className="lg:col-span-4 space-y-6">
            {/* CTA */}
            <div className="bg-indigo-600 rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-8 text-white shadow-xl">
              <Link to="/report">
                <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-sm">
                  Create New Case
                </button>
              </Link>
            </div>

            {/* SUPPORT */}
            <div className="bg-white border border-slate-200 rounded-2xl lg:rounded-[2.5rem] p-6">
              <h4 className="text-xs font-black uppercase tracking-widest mb-4">
                Support Center
              </h4>
              <div className="space-y-3">
                {[
                  "Guidance on Evidence",
                  "Whistleblower Rights",
                  "Contact Investigator",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50"
                  >
                    <span className="text-xs font-bold text-slate-600">
                      {t}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY */}
            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <p className="text-[10px] text-emerald-700 font-medium">
                End-to-end encrypted with AES-256 security.
              </p>
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
            className="fixed inset-0 z-110 bg-slate-900/60 backdrop-blur-sm flex justify-end"
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
              <div className="bg-white/10  backdrop-blur-md sticky top-0 z-10 border-b border-slate-300 sm:p-6 p-2 ">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-col sm:flex-row items-start">
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
                    <h2 className="text-md sm:text-2xl font-black text-slate-900 leading-tight">
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
              <div className="flex-1 overflow-y-auto sm:p-6 p-2 space-y-8">
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
              <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex gap-3">
                <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 scale-90">
                  <Activity className="w-4 h-4" /> Download Report
                </button>
                <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all scale-90">
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
