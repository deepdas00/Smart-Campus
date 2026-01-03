import React, { useState, useEffect } from "react";
import ReactTimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

import {
  Save,
  RotateCcw,
  FileText,
  ChevronRight,
  Clock,
  Calendar,
  Info,
  ShieldCheck,
  Database,
  History,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

import axios from "axios";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function CollegePolicy() {
  const [activeTab, setActiveTab] = useState("library");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [canteenPolicy, setCanteenPolicy] = useState([]);
  const [canteenStatus, setCanteenStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // edit form state
  const [editData, setEditData] = useState({
    openingTime: "",
    closingTime: "",
  });

  const [libraryPolicy, setLibraryPolicy] = useState({
    maxBooksAllowed: "",
    returnPeriodDays: "",
    finePerDay: "",
    maxFine: "",
    lastModified: "",
    updatedBy: "",
  });

  const ENABLE_CANTEEN_POLICY_API = false;

  const fetchCanteenPolicy = async () => {
    try {
      setLoading(true);

      const statusRes = await api.get("/api/v1/canteen/canteenStatus");



      let policy = {
        openingTime: "08:00 AM",
        closingTime: "08:00 PM",
        updatedAt: new Date().toISOString(),
        updatedBy: "System",
      };
      try {
        const policyRes = await api.get("/api/v1/canteen/fetchpolicy");

       

        if (policyRes?.data) {
          policy = policyRes.data.data;
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error(err);
        }
      }

      const localTime = new Date(policy.updatedAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      setCanteenPolicy([
        {
          id: "CAN-001",
          label: "Kitchen Opening Time",
          value: policy.openingTime,
          detail: "Daily breakfast service commencement",
          lastModified: localTime,
        },
        {
          id: "CAN-002",
          label: "Kitchen Closing Time",
          value: policy.closingTime,
          detail: "Final order processing deadline",

          updatedBy: localTime,
        },
      ]);

      setCanteenStatus(statusRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePolicy = async () => {
    try {
      setLoading(true);

      const opening =
        editData.openingTime ||
        canteenPolicy.find((p) => p.id === "CAN-001")?.value;

      const closing =
        editData.closingTime ||
        canteenPolicy.find((p) => p.id === "CAN-002")?.value;

      await api.post("/api/v1/canteen/policy", {
        openingTime: opening,
        closingTime: closing,
      });

      await fetchCanteenPolicy();

      setSuccessMessage("Canteen policy updated successfully");
      setSelectedPolicy(null);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Save policy failed:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "canteen") {
      fetchCanteenPolicy();
      setSelectedPolicy(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!selectedPolicy) return;

    if (selectedPolicy.id === "CAN-001") {
      setEditData((p) => ({ ...p, openingTime: selectedPolicy.value }));
    }

    if (selectedPolicy.id === "CAN-002") {
      setEditData((p) => ({ ...p, closingTime: selectedPolicy.value }));
    }
  }, [selectedPolicy]);

  const libraryTableData = [
    {
      id: "LIB-001",
      label: "Maximum Books Allowed",
      value: libraryPolicy.maxBooksAllowed,
      detail: "Applies to Undergraduate & Postgraduate students",
      lastModified: libraryPolicy.lastModified,
      updatedBy: libraryPolicy.updatedBy,
    },
    {
      id: "LIB-002",
      label: "Standard Return Period",
      value: `${libraryPolicy.returnPeriodDays} Days`,
      detail: "Policy excludes gazetted public holidays",
      lastModified: libraryPolicy.lastModified,
      updatedBy: libraryPolicy.updatedBy,
    },
    {
      id: "LIB-003",
      label: "Fine Amount (Per Day)",
      value: `₹${libraryPolicy.finePerDay}`,
      detail: "Automatic calculation via student portal",
      lastModified: libraryPolicy.lastModified,
      updatedBy: libraryPolicy.updatedBy,
    },
    {
      id: "LIB-004",
      label: "Maximum Fine Amount",
      value: `₹${libraryPolicy.maxFine}`,
      detail: "Automatic calculation via student portal",
      lastModified: libraryPolicy.lastModified,
      updatedBy: libraryPolicy.updatedBy,
    },
  ];

  const fetchLibraryPolicy = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/library/policy");
      const data = res.data.data;

      if (data) {
        const localTime = new Date(data.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        setLibraryPolicy({
          maxBooksAllowed: data.maxBooksAllowed || "",
          returnPeriodDays: data.returnPeriodDays || "",
          finePerDay: data.finePerDay || "",
          maxFine: data.maxFine || "",
          lastModified: localTime,
          updatedBy: data.updatedBy || "System",
        });
      }
    } catch (err) {
      console.error("Failed to fetch library policy:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "library") {
      fetchLibraryPolicy();
      setSelectedPolicy(null);
    }
  }, [activeTab]);

  const handleSaveLibraryPolicy = async () => {
    try {
      setLoading(true);
      await api.post("/api/v1/library/policy", libraryPolicy);
      await fetchLibraryPolicy();

      setSuccessMessage("Library policy updated successfully");
      setSelectedPolicy(null);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Save library policy failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCanteenStatus = async () => {
    await api.post("/api/v1/canteen/isActive", {
      isActive: !canteenStatus,
    });
    setCanteenStatus((p) => !p);
  };

  const data = activeTab === "library" ? libraryTableData : canteenPolicy;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <main className="flex-grow w-full max-w-[1800px] mx-auto ">
        {/* --- MINIMAL HEADER --- */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Institutional Policy Manager
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure global parameters for campus modules.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2">
              <Database size={14} /> DB: EDU_PROD_01
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} /> Auth: Root_Level
            </span>
          </div>
        </div>

        {/* --- DATA TAB NAVIGATION --- */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => {
              setActiveTab("library");
              setSelectedPolicy(null);
            }}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "library"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Library Policy
          </button>
          <button
            onClick={() => {
              setActiveTab("canteen");
              setSelectedPolicy(null);
            }}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === "canteen"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Canteen Policy
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- DATA TABLE (Main Focus) --- */}
          <div
            className={`${
              selectedPolicy ? "lg:col-span-8" : "lg:col-span-12"
            } transition-all duration-300`}
          >
            <div className="border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">
                      Policy Parameter
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">
                      Current Value
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">
                      Last Modified
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-black text-slate-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        selectedPolicy?.id === item.id ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="px-6 py-5 text-xs font-mono text-slate-400">
                        {item.id}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-800">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.detail}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono font-bold text-sm bg-slate-100 px-3 py-1 rounded border border-slate-200">
                          {item.value}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        {item.lastModified} <br />{" "}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {
                            setSelectedPolicy(item);

                            if (activeTab === "canteen") {
                              setEditData({
                                openingTime:
                                  item.id === "CAN-001" ? item.value : "",
                                closingTime:
                                  item.id === "CAN-002" ? item.value : "",
                              });
                            }
                          }}
                          className="
    inline-flex items-center gap-2
    px-4 py-2
    text-xs font-bold uppercase tracking-wider
    text-blue-600
    border border-blue-200
    rounded-md
    bg-blue-50
    hover:bg-blue-600 hover:text-white hover:border-blue-600
    transition-all duration-200
    shadow-sm hover:shadow-md
  "
                        >
                          <FileText size={14} />
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {successMessage && (
            <div
              className="
      fixed top-6 right-6 z-50
      px-6 py-4 z-900
      bg-white
      border border-green-200
      text-green-700
      text-sm font-bold
      rounded-lg
      shadow-xl
      flex items-center gap-3
      animate-in slide-in-from-right-4 duration-300
    "
            >
              <ShieldCheck size={18} className="text-green-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* --- MINIMAL SLIDE-IN EDIT FORM --- */}
          {selectedPolicy && (
            <div className="lg:col-span-4 animate-in slide-in-from-right-4 duration-300">
              <div className="border border-slate-900 p-8 rounded-sm bg-white shadow-xl">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Edit Configuration
                  </h2>
                  <button
                    onClick={() => setSelectedPolicy(null)}
                    className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Parameter Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedPolicy.label}
                      className="w-full border border-slate-200 px-4 py-3 text-sm font-bold bg-slate-50 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    {activeTab === "library" ? (
                      <input
                        type="number"
                        value={
                          selectedPolicy.id === "LIB-001"
                            ? libraryPolicy.maxBooksAllowed
                            : selectedPolicy.id === "LIB-002"
                            ? libraryPolicy.returnPeriodDays
                            : selectedPolicy.id === "LIB-003"
                            ? libraryPolicy.finePerDay
                            : libraryPolicy.maxFine
                        }
                        onChange={(e) => {
                          const map = {
                            "LIB-001": "maxBooksAllowed",
                            "LIB-002": "returnPeriodDays",
                            "LIB-003": "finePerDay",
                            "LIB-004": "maxFine",
                          };

                          setLibraryPolicy((p) => ({
                            ...p,
                            [map[selectedPolicy.id]]: e.target.value,
                          }));
                        }}
                        className="w-full border border-slate-900 px-4 py-3 text-sm font-bold focus:outline-none bg-white"
                      />
                    ) : (
                      /* 🔥 KEEP YOUR EXISTING TIME INPUT CODE HERE */
                      /* (Opening / Closing time UI stays exactly same) */

                      <div>
                        {/* Time Input Group */}
                        <div className="relative group max-w-sm">
                          {/* Modern Header with Status Dot */}
                          <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[11px] font-bold text-slate-400  px-2 py-0.5 rounded-full uppercase">
                              Opening Time
                            </span>
                          </div>

                          {/* Main Clock Container */}
                          <div className="relative">
                            {/* Subtle Glow Backdrop */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative flex items-center bg-white/80 backdrop-blur-md border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-1.5 transition-all duration-300 group-focus-within:border-blue-500 group-focus-within:shadow-blue-500/10">
                              {/* Left Icon Section */}
                              {/* <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Clock size={22} strokeWidth={2} />
                          </div> */}

                              {/* The Input - Styled to look like a digital clock readout */}
                              <input
                                type="time"
                                step="60" // Ensures minute-level precision
                                value={
                                  selectedPolicy.id === "CAN-001"
                                    ? editData.openingTime
                                    : editData.closingTime
                                }
                                onChange={(e) => {
                                  const field =
                                    selectedPolicy.id === "CAN-001"
                                      ? "openingTime"
                                      : "closingTime";
                                  setEditData((p) => ({
                                    ...p,
                                    [field]: e.target.value,
                                  }));
                                }}
                                className="flex-1 bg-transparent border-none text-[15px] font-black text-slate-800 px-4 focus:ring-0 cursor-pointer tracking-widest uppercase placeholder:text-slate-300"
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace", // Optional: adds a technical/digital feel
                                }}
                              />

                              {/* Modern "Action" Zone */}
                              <div className="flex items-center gap-1 pr-3">
                                <div className="h-8 w-[1px] bg-slate-100 mr-2" />
                                <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                  <Calendar size={18} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Visual Progress Bar (Purely aesthetic, feels like a timer) */}
                          <div className="mt-4 flex gap-1 justify-center">
                            {[...Array(12)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1 w-6 rounded-full transition-colors duration-500 ${
                                  i < 4 ? "bg-blue-500" : "bg-slate-100"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Internal Note
                    </label>
                    <textarea
                      rows="3"
                      defaultValue={selectedPolicy.detail}
                      className="w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <button
                      onClick={
                        activeTab === "library"
                          ? handleSaveLibraryPolicy
                          : handleSavePolicy
                      }
                      disabled={loading}
                      className={`w-full py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 ${
                        loading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Confirm & Commit
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedPolicy(null)}
                      className="w-full bg-white text-slate-500 py-4 text-xs font-bold uppercase tracking-[0.2em] border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={16} /> Discard Changes
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50/50 rounded text-blue-700">
                  <Info size={16} className="mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase leading-relaxed">
                    Changes are recorded in the system audit log with your admin
                    signature.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- SYSTEM LOG (Full Width Footer Data) --- */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
            <History size={14} /> Global Change History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-1 h-10 bg-slate-200 mt-1"></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    2 hours ago
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    Admin_Alpha modified [Fine Amount]
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase">
                    Result: Success (200 OK)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
