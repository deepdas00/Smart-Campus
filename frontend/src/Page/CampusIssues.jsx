import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, FileWarning, Clock, ExternalLink, Download, MoreHorizontal, ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cookies from "js-cookie";

// PDF Download Helper
const downloadReport = (r) => {
  const doc = new jsPDF();
  
  // Header Banner
  doc.setFillColor(79, 70, 229); 
  doc.rect(0, 0, 210, 40, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INCIDENT REPORT", 120, 20);
  
  doc.setFontSize(10);
  doc.text(`Ref ID: #${r._id.substring(0, 8).toUpperCase()}`, 120, 28);

  // CORRECT WAY TO CALL AUTOTABLE:
  autoTable(doc, {
    startY: 50,
    head: [['Official Incident Specification', 'Details']],
    body: [
      ['Report Title', r.title],
      ['Issue Category', r.category || "General"],
      ['Priority Level', r.priority.toUpperCase()],
      ['Current Status', r.status.toUpperCase()],
      ['Student Name', r.studentId?.studentName || "Guest"],
      ['Roll Number', r.studentId?.rollNo || "N/A"],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
  });

  // Description Section
  const finalY = doc.lastAutoTable.finalY;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Incident Description:", 14, finalY + 15);
  doc.setFont("helvetica", "normal");
  doc.text(r.description || "No description provided.", 14, finalY + 22, { maxWidth: 180 });

  doc.save(`Report_${r._id.substring(0, 5)}.pdf`);
};

// Generic detail grid
const DetailGrid = ({ items }) => (
  <div className="grid grid-cols-2 gap-4">
    {items.map(([label, value]) => (
      <div key={label}>
        <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value || "—"}</p>
      </div>
    ))}
  </div>
);

// Category-specific detail component
const CategoryDetails = ({ report }) => {
  if (!report) return null;

  switch (report.category) {
    case "researchandlab":
      return <DetailGrid items={[["Building", report.building], ["Room / Lab", report.room]]} />;
    case "housinganddorms":
      return <DetailGrid items={[["Hostel Block", report.building], ["Room", report.room], ["Zone", report.zone]]} />;
    case "groundandpublic":
      return <DetailGrid items={[["Area / Zone", report.zone], ["Building", report.building || "N/A"]]} />;
    case "Library":
      return <DetailGrid items={[["Shelf / Section", report.section], ["Floor", report.floor]]} />;
    case "Canteen":
      return <DetailGrid items={[["Canteen Area", report.area], ["Menu Issue", report.menuIssue || "N/A"]]} />;
    case "Hostel":
      return <DetailGrid items={[["Hostel Block", report.building], ["Room", report.room]]} />;
    case "Infrastructure":
      return <DetailGrid items={[["Building", report.building], ["Issue Type", report.issueType]]} />;
    default:
      return <DetailGrid items={[["Description", report.description]]} />;
  }
};

// Admin panel
export default function CampusIssues() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [range, setRange] = useState("weekly");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [collegeCode, setCollegeCode] = useState(null);


const handleSelectReport = async (r) => {
  try {

    console.log(r._id);
    

const res = await axios.post(
  `${API_URL}/api/v1/reports/getMySingleReports`,
  {
    reportId: r._id,
    collegeCode: collegeCode,
  },
  {
    withCredentials: true, // browser sends cookie automatically
  }
);

    console.log("API response:", res.data);
    setSelectedReport(res.data.data);

  } catch (error) {
    console.error(
      "API ERROR:",
      error.response?.data || error.message
    );
  }
};






  useEffect(() => {
    fetchReports();
  }, [range]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/v1/reports/${range}/all`, { withCredentials: true });
      console.log(res.data.data);
      
      setReports(res.data.data.reports || []);
      setCollegeCode(res.data.data.collegeCode)
    } catch (err) {
      console.error("Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchStatus = statusFilter === "All" || r.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.studentId?.studentName?.toLowerCase().includes(search.toLowerCase()) ||
        r.category?.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [reports, statusFilter, search]);

  const getPriorityStyle = (p) => {
    const val = p?.toLowerCase();
    if (val === "urgent" || val === "critical") return "bg-red-100 text-red-700 ring-1 ring-red-200";
    if (val === "medium") return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
    return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  };

  const getStatusStyle = (s) => {
    const val = s?.toLowerCase();
    if (["fixed", "closed", "resolved"].includes(val)) return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
    if (val === "in progress") return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
    return "bg-slate-50 text-slate-500 ring-1 ring-slate-200";
  };

  const categoryLabel = {
    researchandlab: "Research & Lab",
    housinganddorms: "Housing & Dorms",
    groundandpublic: "Ground & Public Area",
    Library: "Library",
    Canteen: "Canteen",
    Hostel: "Hostel",
    Infrastructure: "Infrastructure",
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issue Management</h1>
            <p className="text-slate-500 text-sm font-medium">Track and resolve campus infrastructure reports</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            {["daily", "weekly", "monthly"].map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${range === r ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted By</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.length > 0 ? filteredReports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                          <FileWarning size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate leading-tight mb-1">{r.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{categoryLabel[r.category]}</span>
                            <span className="text-slate-300 text-xs">•</span>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1"><Clock size={10}/> {new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{r.studentId?.studentName || "Guest"}

                      <p className="text-[10px] text-slate-400 font-medium">{r.studentId?.rollNo || "N/A"}</p>

                    </td>
                    <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${getPriorityStyle(r.priority)}`}>{r.priority}</span></td>
                    <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${getStatusStyle(r.status)}`}>{r.status}</span></td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleSelectReport(r)}className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        
                        <ExternalLink size={16} />
                        
                        </button>


                      <button onClick={() => downloadReport(r)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><Download size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><MoreHorizontal size={16} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-bold">No reports found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected report details */}
{selectedReport && (
  <div className="fixed inset-0 z-[150] flex justify-center items-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
    
    {/* Popup container */}
    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-zoomIn">
      
      {/* Header with Background Accent */}
      <div className="flex items-center justify-between px-8 py-5 bg-slate-50/50 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1 block">
            Report Details
          </span>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {selectedReport.title}
          </h2>
        </div>

        <button
          onClick={() => setSelectedReport(null)}
          className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all duration-200 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Area - Scrollable if content is long */}
      <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
        
        {selectedReport.image && (
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <img
              src={selectedReport.image}
              alt="Evidence"
              className="relative w-full h-72 object-cover rounded-2xl shadow-md border border-slate-100"
            />
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
          <CategoryDetails report={selectedReport} />
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
          <p className="text-slate-700 leading-relaxed font-medium">
            {selectedReport.description}
          </p>
        </div>
      </div>

      {/* Optional Footer */}
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={() => setSelectedReport(null)}
          className="px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          Close Report
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
