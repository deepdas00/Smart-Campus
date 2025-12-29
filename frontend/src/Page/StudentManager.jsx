import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  GraduationCap,
  Search,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function StudentManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users/student/allStudent`,
          { withCredentials: true }
        );

        console.log(res.data.data);
        
        setStudents(res.data.data || []);
      } catch (err) {
        console.error("Error fetching students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ---------------- FILTER ----------------
  const query = searchQuery.toLowerCase();

  const filteredStudents = students.filter((s) =>
    s.studentName?.toLowerCase().includes(query) ||
    s.rollNo?.toLowerCase().includes(query) ||
    s.email?.toLowerCase().includes(query) ||
    s.department?.toLowerCase().includes(query)
  );

  // ---------------- STATS ----------------
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.isActive).length;
  const inactiveStudents = totalStudents - activeStudents;
  const finalYear = students.filter((s) => s.year === "4th Year").length;

  // ---------------- LOADER ----------------
  const TableLoader = ({ cols = 6 }) => (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i}>
          {[...Array(cols)].map((__, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          Student Authority
        </h2>
        <p className="text-gray-500 text-sm font-medium">
          Centralized academic records & enrollment tracking
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: totalStudents, icon: Users },
          { title: "Active", value: activeStudents, icon: CheckCircle2 },
          { title: "Inactive", value: inactiveStudents, icon: AlertCircle },
          { title: "Final Year", value: finalYear, icon: GraduationCap },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase text-gray-400">
                  {s.title}
                </p>
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* SEARCH */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search name, roll, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 pr-4 py-2.5 text-sm font-medium
              rounded-xl border border-gray-200 bg-white
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Roll</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Department</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Year</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <TableLoader cols={6} />
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s._id} className="hover:bg-blue-50/30 transition">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {s.rollNo}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">
                      {s.studentName}
                    </div>
                    <div className="text-xs text-gray-500">{s.email}</div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {s.department}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    {s.year}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        s.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
