import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  GraduationCap,
  Layers,
  Search,
  Plus,
  Edit,
  Power,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);


  const [form, setForm] = useState({
    departmentName: "",
    shortCode: "",
  });
  const [editId, setEditId] = useState(null);

  const API = `${import.meta.env.VITE_API_URL}/api/v1/department`;

  // ---------------- FETCH ----------------
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setIsLoading(true);
      const res = await axios.get(`${API}/all`, {
        withCredentials: true,
      });
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Department fetch failed", err);
    } finally {
      setLoading(false);
       setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ---------------- CREATE / UPDATE ----------------
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);

    if (editId) {
      await axios.post(`${API}/update/${editId}`, form, {
        withCredentials: true,
      });
      setShowEditModal(false); // 👈 close popup
    } else {
      await axios.post(`${API}/set`, form, {
        withCredentials: true,
      });
    }

    setForm({ departmentName: "", shortCode: "" });
    setEditId(null);
    fetchDepartments();
  } catch (err) {
    console.error("Save failed", err);
  } finally {
    setIsLoading(false);
  }
};


  // ---------------- TOGGLE STATUS ----------------
  const toggleStatus = async (id) => {
    try {
        setIsLoading(true);
      await axios.post(`${API}/status/${id}`, {}, { withCredentials: true });
      fetchDepartments();
    } catch (err) {
      console.error("Toggle failed", err);
    }finally {
    setIsLoading(false);
  }
  };

  // ---------------- ANALYTICS ----------------
  const stats = useMemo(() => {
    const total = departments.length;
    const active = departments.filter((d) => d.isActive).length;
    return { total, active, inactive: total - active };
  }, [departments]);

  const filtered = departments.filter((d) =>
    [d.departmentName, d.shortCode]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HEADER */}

      {isLoading && (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-600">
        Processing...
      </p>
    </div>
  </div>
)}


{showEditModal && (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-black text-slate-900 mb-4">
        Edit Department
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
          placeholder="Department Name"
          value={form.departmentName}
          onChange={(e) =>
            setForm({ ...form, departmentName: e.target.value })
          }
          required
        />

        <input
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
          placeholder="Short Code"
          value={form.shortCode}
          onChange={(e) =>
            setForm({ ...form, shortCode: e.target.value })
          }
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setShowEditModal(false);
              setEditId(null);
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}








      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Department Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            College Academic Structure Overview
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Departments"
          value={stats.total}
          icon={Layers}
          color="indigo"
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          label="Inactive"
          value={stats.inactive}
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-4"
      >
        <input
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
          placeholder="Department Name"
          value={form.departmentName}
          onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
          required
        />
        <input
          className="w-full md:w-40 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
          placeholder="Short Code"
          value={form.shortCode}
          onChange={(e) => setForm({ ...form, shortCode: e.target.value })}
          required
        />
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4" />
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* SEARCH */}
        <div className="p-5 border-b border-slate-100 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search department..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <TableLoader />
            ) : (
              filtered.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {d.departmentName}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-bold">
                    {d.shortCode}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        d.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {d.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex items-right gap-3">
                    <button
  onClick={() => {
    setEditId(d._id);
    setForm({
      departmentName: d.departmentName,
      shortCode: d.shortCode,
    });
    setShowEditModal(true);
  }}
  className="p-2 hover:bg-slate-100 rounded-lg"
>
  <Edit className="w-4 h-4" />
</button>

                    <button
                      onClick={() => toggleStatus(d._id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        d.isActive ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                          d.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>

                    <span
                      className={`text-xs font-bold ${
                        d.isActive ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {d.isActive ? "Active" : "Inactive"}
                    </span>
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

// ---------------- COMPONENTS ----------------

function StatCard({ label, value, icon: Icon, color }) {
  const map = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex gap-4 shadow-sm">
      <div className={`p-3 rounded-xl ${map[color]} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function TableLoader() {
  return [...Array(4)].map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td colSpan={4} className="px-6 py-5">
        <div className="h-8 bg-slate-100 rounded-xl" />
      </td>
    </tr>
  ));
}
