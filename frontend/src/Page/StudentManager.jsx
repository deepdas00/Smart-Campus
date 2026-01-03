import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users,
  GraduationCap,
  Search,
  AlertCircle,
  CheckCircle2,
  Download,
  Phone,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  ExternalLink,
  X,
  BookOpen,
  Mail,
  Hash,
  Clock,
} from "lucide-react";

export function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeCode, setCollegeCode] = useState("");

  // New States for Detail View
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ---------------- FETCH LIST ----------------
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users/student/allStudent`,
          { withCredentials: true }
        );
        setCollegeCode(res.data.collegeCode);
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ---------------- FETCH ONE STUDENT ----------------
  const fetchOneStudentDetails = async (cCode, userId) => {
    try {
      setDetailsLoading(true);
      setIsDrawerOpen(true); // Open the drawer immediately to show a loader
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/users/student/collegeStudentDetails`,
        { collegeCode: cCode, userId },
        { withCredentials: true }
      );

    

      setSelectedStudent(res.data); // Stores { student, libraryTransaction, message }
    } catch (err) {
      console.error("Error fetching details", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ---------------- ANALYTICS LOGIC ----------------
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.isActive).length;
    const deptCount = students.reduce((acc, s) => {
      acc[s.department] = (acc[s.department] || 0) + 1;
      return acc;
    }, {});
    const sortedDepts = Object.entries(deptCount).sort((a, b) => b[1] - a[1]);
    return {
      total,
      active,
      totalDepts: Object.keys(deptCount).length,
      leadingDept: sortedDepts[0]?.[0] || "N/A",
      leadingCount: sortedDepts[0]?.[1] || 0,
    };
  }, [students]);

  const filteredStudents = students.filter((s) =>
    [s.studentName, s.rollNo, s.email, s.department].some((val) =>
      val?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className=" bg-white min-h-screen font-sans">
      {/* DRAWER COMPONENT */}
      <StudentDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedStudent(null);
        }}
        data={selectedStudent}
        loading={detailsLoading}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Database Overview & Administrative Controls
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <StatCard
          label="Total Enrollment"
          value={stats.total}
          icon={Users}
          color="indigo"
        />

        {/* Active Students */}
        <StatCard
          label="Active Now"
          value={stats.active}
          icon={CheckCircle2}
          color="emerald"
        />

        {/* Total Departments */}
        <StatCard
          label="Total Departments"
          value={stats.totalDepts}
          icon={GraduationCap}
          color="blue"
        />

        {/* Leading Department */}
        <StatCard
          label="Leading Dept"
          value={stats.leadingDept}
          subValue={`${stats.leadingCount} Students`} // Pass this to your StatCard if you want a sub-label
          icon={ArrowUpRight} // You can import this from lucide-react
          color="purple"
        />
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* SEARCH & FILTERS */}
        <div className="p-5 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll, or department..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Student Profile
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Academic Info
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Contact Details
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Account Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableLoader />
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={s.avatar}
                          alt={s.studentName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {s.studentName}
                          </p>
                          <p className="text-[12px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-1">
                            {s.rollNo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-700">
                          {s.department}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                          <Calendar className="w-3 h-3" /> Batch{" "}
                          {s.admissionYear}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 font-medium">
                        {s.email}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-bold">
                        <Phone className="w-3 h-3" /> {s.mobileNo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wide ${
                          s.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {s.isActive ? "VERIFIED" : "DISABLED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            fetchOneStudentDetails(collegeCode, s._id)
                          }
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition border border-transparent hover:border-slate-200 shadow-none hover:shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------- SUB-COMPONENTS ----------------

// ---------------- DRAWER COMPONENT ----------------

function StudentDetailsDrawer({ isOpen, onClose, data, loading }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[250] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 px-6 py-5 flex items-center justify-between 
                bg-blue-800 backdrop-blur-md border-b border-slate-100"
        >
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-indigo-100 uppercase tracking-[0.2em]">
              Administrative View
            </h2>
            <p className="text-xl font-bold text-indigo-500 tracking-tight">
              Student Comprehensive Profile
            </p>
          </div>

          <button
            onClick={onClose}
            className="group p-2.5 bg-slate-50 hover:bg-rose-50 rounded-xl transition-all duration-200 border border-slate-200 hover:border-rose-100"
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-rose-500 group-hover:rotate-90 transition-all" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">
                Gathering Data...
              </p>
            </div>
          ) : (
            data && (
              <div className="space-y-8">
                {/* Personal Info Header */}
                <div className="flex items-center gap-6">
                  <img
                    src={data.student.avatar}
                    alt=""
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50"
                  />
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {data.student.studentName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                        {data.student.rollNo}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase ${
                          data.student.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {data.student.isActive
                          ? "Account Active"
                          : "Account Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoBox
                    icon={Mail}
                    label="Email Address"
                    value={data.student.email}
                  />
                  <InfoBox
                    icon={Phone}
                    label="Mobile"
                    value={data.student.mobileNo}
                  />
                  <InfoBox
                    icon={GraduationCap}
                    label="Department"
                    value={data.student.department}
                  />
                  <InfoBox
                    icon={Calendar}
                    label="Admission Year"
                    value={data.student.admissionYear}
                  />
                </div>

                {/* Library Transactions */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">
                        Active Library Transactions
                      </h4>
                    </div>

                    {data.libraryTransaction?.some((t) => t.fineAmount > 0) && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 animate-pulse items-center justify-between flex">
                        Action Required: Fines Pending
                      </span>
                    )}
                  </div>

                  {data.libraryTransaction?.length > 0 ? (
                    <div className="space-y-3">
                      {data.libraryTransaction.map((tr) => {
                        const hasFine = tr.fineAmount > 0;

                        return (
                          <div
                            key={tr._id}
                            className={`relative rounded-2xl p-4 border transition-all duration-300 flex gap-4 ${
                              hasFine
                                ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <img
                              src={tr.bookId.coverImage}
                              alt=""
                              className="w-14 h-20 object-cover rounded shadow-sm"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900 leading-tight">
                                {tr.bookId.title}
                              </p>

                              <p className="text-[11px] text-slate-500 font-medium">
                                Author: {tr.bookId.author}
                              </p>

                              <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    Issue Date
                                  </span>
                                  <span className="text-[11px] font-bold text-slate-700">
                                    {new Date(
                                      tr.issueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    Due Date
                                  </span>
                                  <span className="text-[11px] font-bold text-rose-600">
                                    {new Date(tr.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex flex-col justify-between">
                              <span className="text-[10px] font-black bg-white px-2 py-1 rounded border border-slate-200 uppercase">
                                {tr.transactionStatus}
                              </span>

                              {hasFine && (
                                <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-black text-white bg-rose-600 px-2 py-0.5 rounded shadow-lg">
                                    FINE: ₹{tr.fineAmount}
                                  </span>
                                  <span className="text-[8px] font-bold text-rose-400 uppercase mt-1">
                                    {tr.paymentStatus}
                                  </span>
                                </div>
                              )}

                              <span className="text-[11px] font-black text-indigo-600">
                                ID: {tr.transactionCode}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-sm font-bold text-slate-400">
                        No active books found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-indigo-500" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-slate-900 break-words">{value}</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, subValue }) {
  const colorMap = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-500",
    purple: "bg-purple-600",
    blue: "bg-blue-500",
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-5 shadow-sm">
      <div
        className={`p-3.5 rounded-xl ${colorMap[color]} text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-xl font-black text-slate-900 truncate max-w-[150px]">
          {value}
        </p>
        {subValue && (
          <p className="text-[10px] font-bold text-indigo-500 mt-0.5">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}

function TableLoader() {
  return [...Array(5)].map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td colSpan={5} className="px-6 py-5">
        <div className="h-10 bg-slate-100 rounded-xl w-full" />
      </td>
    </tr>
  ));
}
