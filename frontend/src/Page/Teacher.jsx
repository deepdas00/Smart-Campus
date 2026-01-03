import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Download,
  Plus,
  ExternalLink,
  MoreHorizontal,
  X,
  CheckCircle2,
} from "lucide-react";

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function TeacherManager() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);

  /* ---------------- FETCH ALL TEACHERS ---------------- */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users/teacher/all`,
          { withCredentials: true }
        );
        setTeachers(res.data.teachers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  /* ---------------- FETCH SINGLE TEACHER ---------------- */
  const fetchTeacherDetails = async (id) => {
    try {
      setIsDrawerOpen(true);
      setDetailsLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/users/teacher/${id}`,
        { withCredentials: true }
      );
      setSelectedTeacher(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* ---------------- ANALYTICS ---------------- */
  const stats = useMemo(() => {
    return {
      total: teachers.length,
      active: teachers.filter((t) => t.isActive).length,
    };
  }, [teachers]);

  const filteredTeachers = teachers.filter((t) =>
    [t.fullName, t.email, t.designation, t.department]
      .some((v) => v?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white min-h-screen p-6">

      {/* DRAWERS */}
      <TeacherDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTeacher(null);
        }}
        data={selectedTeacher}
        loading={detailsLoading}
      />

      <AddTeacherDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={(teacher) => {
          setTeachers((prev) => [teacher, ...prev]);
          setIsAddOpen(false);
        }}
      />

      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black">Teacher Management</h1>
          <p className="text-slate-500">Faculty database & controls</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold"
          >
            <Plus className="w-4 h-4" /> Add Teacher
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 border rounded-xl font-bold">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <StatCard label="Total Teachers" value={stats.total} />
        <StatCard
          label="Active Teachers"
          value={stats.active}
          icon={CheckCircle2}
        />
      </div>

      {/* TABLE */}
      <div className="border rounded-2xl overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl"
              placeholder="Search teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs">Name</th>
              <th className="px-6 py-4 text-left text-xs">Department</th>
              <th className="px-6 py-4 text-left text-xs">Designation</th>
              <th className="px-6 py-4 text-left text-xs">Email</th>
              <th className="px-6 py-4 text-right text-xs">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableLoader />
            ) : (
              filteredTeachers.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold">{t.fullName}</td>
                  <td className="px-6 py-4">{t.department}</td>
                  <td className="px-6 py-4">{t.designation}</td>
                  <td className="px-6 py-4 text-sm">{t.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => fetchTeacherDetails(t._id)}
                      className="p-2 hover:text-indigo-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-2">
                      <MoreHorizontal className="w-4 h-4" />
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

/* ======================================================
   ADD TEACHER DRAWER (ALL REQUIRED FIELDS)
====================================================== */

function AddTeacherDrawer({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    teacherCode: "",
    employeeId: "",
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    userId: "",
    password: "",
    collegeCode: "",
  });

  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/teacher/create`,
        form,
        { withCredentials: true }
      );
      onSuccess(res.data.teacher);
    } catch (err) {
      console.error(err);
      alert("Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 overflow-y-auto">
        <div className="p-5 flex justify-between border-b">
          <h2 className="text-xl font-black">Add Teacher</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField label="Teacher Code" name="teacherCode" value={form.teacherCode} onChange={handleChange} required />
          <FormField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} required />
          <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <SelectField label="Gender" name="gender" value={form.gender} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          <FormField label="Department" name="department" value={form.department} onChange={handleChange} required />
          <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} required />
          <FormField label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} required />
          <FormField label="User ID" name="userId" value={form.userId} onChange={handleChange} required />
          <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <FormField label="College Code" name="collegeCode" value={form.collegeCode} onChange={handleChange} required />

          <button
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl"
          >
            {loading ? "Creating..." : "Create Teacher"}
          </button>
        </form>
      </div>
    </>
  );
}

/* ======================================================
   REUSABLE COMPONENTS
====================================================== */

function FormField({ label, required, ...props }) {
  return (
    <div>
      <label className="text-sm font-bold">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        {...props}
        className="mt-1 w-full px-4 py-2 border rounded-xl"
      />
      {required && (
        <p className="text-xs text-rose-500 mt-1">
          This field is required
        </p>
      )}
    </div>
  );
}

function SelectField({ label, required, ...props }) {
  return (
    <div>
      <label className="text-sm font-bold">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        {...props}
        className="mt-1 w-full px-4 py-2 border rounded-xl"
      >
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      {required && (
        <p className="text-xs text-rose-500 mt-1">
          This field is required
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon = Users }) {
  return (
    <div className="p-6 border rounded-2xl flex gap-4">
      <div className="p-3 bg-indigo-600 text-white rounded-xl">
        <Icon />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xl font-black">{value}</p>
      </div>
    </div>
  );
}

function TableLoader() {
  return [...Array(4)].map((_, i) => (
    <tr key={i}>
      <td colSpan="5" className="p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded" />
      </td>
    </tr>
  ));
}

function TeacherDetailsDrawer({ isOpen, onClose, data, loading }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50">
        <div className="p-5 flex justify-between border-b">
          <h2 className="font-black">Teacher Profile</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-6">
          {loading ? "Loading..." : data && (
            <div className="space-y-2">
              <p><b>Name:</b> {data.fullName}</p>
              <p><b>Email:</b> {data.email}</p>
              <p><b>Department:</b> {data.department}</p>
              <p><b>Designation:</b> {data.designation}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
