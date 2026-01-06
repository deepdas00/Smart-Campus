import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Download,
  RefreshCw,
  Plus,
  ExternalLink,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Building2,
  User,
  Globe,
  Hash,
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

  const API_BASE = import.meta.env.VITE_API_URL;

  /* ---------------- FETCH ALL TEACHERS ---------------- */
  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/v1/teacher/all`, {
        withCredentials: true,
      });
      console.log(res.data.data);

      setTeachers(res.data.data || []);
    } catch (err) {
      console.error(
        "Fetch teachers failed:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ---------------- FETCH SINGLE TEACHER ---------------- */
  const fetchTeacherDetails = async (id) => {
    try {
      setIsDrawerOpen(true);
      setDetailsLoading(true);

      console.log(id);

      const res = await axios.get(`${API_BASE}/api/v1/teacher/${id}`, {
        withCredentials: true, // sends cookies for JWT auth
      });

      console.log("HIIHIHHI", res.data.data);

      setSelectedTeacher(res.data.data); // store the teacher object
    } catch (err) {
      console.error("Fetch teacher failed:", err.response?.data || err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* ---------------- TOGGLE TEACHER STATUS ---------------- */
  const toggleStatus = async (id) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/teacher/status/${id}`,
        {},
        { withCredentials: true }
      );
      setTeachers((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, isActive: res.data.status } : t
        )
      );
    } catch (err) {
      console.error("Toggle status failed:", err.response?.data || err.message);
      alert("Failed to toggle teacher status");
    }
  };

  /* ---------------- ANALYTICS ---------------- */
  const stats = useMemo(
    () => ({
      total: teachers.length,
      active: teachers.filter((t) => t.isActive).length,
    }),
    [teachers]
  );

  /* ---------------- FILTERED TEACHERS ---------------- */
  const filteredTeachers = teachers.filter((t) =>
    [t.fullName, t.email, t.designation, t.department?.departmentName].some(
      (v) => v?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="bg-white min-h-screen ">
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
        onClose={() => {
          setIsAddOpen(false);
          setSelectedTeacher(null);
        }}
        mode={selectedTeacher ? "edit" : "add"}
        initialData={selectedTeacher}
        onSuccess={(teacher) => {
          setTeachers((prev) =>
            selectedTeacher
              ? prev.map((t) => (t._id === teacher._id ? teacher : t))
              : [teacher, ...prev]
          );
          setIsAddOpen(false);
          setSelectedTeacher(null);
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
          icon={CheckCircle}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden">
        {/* Table Header / Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-sm"
              placeholder="Search by name, code or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Faculty Member
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Teacher Code
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Department & Post
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-right">
                  Toggle Status
                </th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableLoader />
              ) : filteredTeachers.length ? (
                filteredTeachers.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Profile & Name Grouped */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={t.profilePhoto || "/avatar.png"}
                            alt={t.fullName}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              t.isActive ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          ></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {t.fullName}
                          </p>
                          <p className="text-xs text-slate-500 font-medium tracking-tight">
                            ID: {t._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                        {t.teacherCode}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {t.department?.departmentName || "General"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">
                        {t.designation}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 font-medium">
                        {t.phone}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleStatus(t._id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                          t.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {t.isActive ? "● Active" : "○ Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(t._id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          t.isActive ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                            t.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => fetchTeacherDetails(t._id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Profile"
                        >
                          <ExternalLink size={16} />{" "}
                          {/* Use a lucide icon for "View" */}
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTeacher(t);
                            setIsAddOpen(true);
                          }}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          title="Edit Teacher"
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">
                        No faculty members found.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   ADD TEACHER DRAWER
====================================================== */
function AddTeacherDrawer({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData = null,
}) {
  const emptyForm = {
    teacherCode: "",
    employeeId: "",
    fullName: "",
    gender: "",
    dob: "",
    profilePhoto: null,

    email: "",
    phone: "",
    alternatePhone: "",

    address: {
      line1: "",
      city: "",
      state: "",
      pincode: "",
    },

    department: "",
    designation: "",
    qualification: "",
    specialization: "",
    experienceYears: "",
    joiningDate: "",
    employmentType: "permanent",

    salary: {
      base: "",
      allowances: "",
      deductions: "",
      net: "",
    },

    bankDetails: {
      accountNo: "",
      ifsc: "",
      bankName: "",
    },

    totalLeaves: "",
  };

  // const [form, setForm] = useState({
  //   // Identity
  //   teacherCode: "",
  //   employeeId: "",
  //   fullName: "",
  //   gender: "",
  //   dob: "",

  //   profilePhoto: null,

  //   // Contact
  //   email: "",
  //   phone: "",
  //   alternatePhone: "",

  //   address: {
  //     line1: "",
  //     city: "",
  //     state: "",
  //     pincode: "",
  //   },

  //   // Professional
  //   department: "", // ObjectId
  //   designation: "",
  //   qualification: "",
  //   specialization: "", // comma separated (UI)
  //   experienceYears: "",
  //   joiningDate: "",
  //   employmentType: "permanent",

  //   // Auto-calculate net salary

  //   // Payroll
  //   salary: {
  //     base: "",
  //     allowances: "",
  //     deductions: "",
  //     net: "",
  //   },

  //   bankDetails: {
  //     accountNo: "",
  //     ifsc: "",
  //     bankName: "",
  //   },

  //   totalLeaves: "",
  // });

  const [form, setForm] = useState(emptyForm);

  const netSalary =
    (parseFloat(form.salary.base) || 0) +
    (parseFloat(form.salary.allowances) || 0) -
    (parseFloat(form.salary.deductions) || 0);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...emptyForm,

        // BASIC INFO
        teacherCode: initialData.teacherCode || "",
        employeeId: initialData.employeeId || "",
        fullName: initialData.fullName || "",
        gender: initialData.gender || "",

        // FIX DATE FORMAT
        dob: initialData.dob ? initialData.dob.slice(0, 10) : "",
        joiningDate: initialData.joiningDate
          ? initialData.joiningDate.slice(0, 10)
          : "",

        // CONTACT
        email: initialData.email || "",
        phone: initialData.phone || "",
        alternatePhone: initialData.alternatePhone || "",

        // ADDRESS
        address: {
          line1: initialData.address?.line1 || "",
          city: initialData.address?.city || "",
          state: initialData.address?.state || "",
          pincode: initialData.address?.pincode || "",
        },

        // 🔥 FIX DEPARTMENT (ID ONLY)
        department: initialData.department?._id || "",

        designation: initialData.designation || "",
        qualification: initialData.qualification || "",
        experienceYears: initialData.experienceYears || "",
        employmentType: initialData.employmentType || "permanent",
        totalLeaves: initialData.totalLeaves || "",

        // SPECIALIZATION
        specialization: Array.isArray(initialData.specialization)
          ? initialData.specialization.join(", ")
          : "",

        // SALARY
        salary: {
          base: initialData.salary?.base || "",
          allowances: initialData.salary?.allowances || "",
          deductions: initialData.salary?.deductions || "",
          net: "", // auto-calculated
        },

        // BANK
        bankDetails: {
          bankName: initialData.bankDetails?.bankName || "",
          accountNo: initialData.bankDetails?.accountNo || "",
          ifsc: initialData.bankDetails?.ifsc || "",
        },

        // ⚠️ KEEP URL, DON’T FORCE FILE
        profilePhoto: initialData.profilePhoto || null,
      });
    }

    if (mode === "add") {
      setForm(emptyForm);
    }
  }, [mode, initialData]);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/department/all`,
          { withCredentials: true }
        );
        setDepartments(res.data.data || []);
      } catch (err) {
        console.error("Fetch departments failed", err);
      }
    };

    fetchDepartments();
  }, []);

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePhoto") {
      setForm({ ...form, profilePhoto: files[0] });
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm({
        ...form,
        [parent]: {
          ...form[parent],
          [child]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const net =
        (parseFloat(form.salary.base) || 0) +
        (parseFloat(form.salary.allowances) || 0) -
        (parseFloat(form.salary.deductions) || 0);

      const submitForm = {
        ...form,
        salary: {
          ...form.salary,
          net: net.toFixed(2),
        },
        specialization: form.specialization.split(",").map((v) => v.trim()),
      };

      let res;

      

      if (mode === "edit") {
        // 🔴 UPDATE TEACHER

        console.log("UPDATEEEEEEEE",submitForm);
        
        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/teacher/update/${
            initialData._id
          }`,
          submitForm,
          { withCredentials: true }
        );
      } else {
        // 🟢 CREATE TEACHER
        const formData = new FormData();

        Object.entries(submitForm).forEach(([key, value]) => {
          if (typeof value === "object" && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        });

        console.log(formData);
        

        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/teacher/registration`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      onSuccess(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-110" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-200 overflow-y-auto">
        <div className="p-5 flex justify-between border-b">
          <h2 className="text-xl font-black">
            {mode === "edit" ? "Edit Teacher" : "Add Teacher"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10 bg-white">
          {/* SECTION 1: PERSONAL IDENTITY */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                Personal Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <FormField
                label="Teacher Code"
                name="teacherCode"
                value={form.teacherCode}
                onChange={handleChange}
                required
              />
              <FormField
                label="Employee ID"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                required
              />
              <SelectField
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              />
              <FormField
                label="Date of Birth"
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
              <FormField
                label="Joining Date"
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* SECTION 2: CONTACT & ADDRESS */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormField
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <FormField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <FormField
                label="Alternate Phone"
                name="alternatePhone"
                value={form.alternatePhone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="md:col-span-1">
                <FormField
                  label="Address Line"
                  name="address.line1"
                  value={form.address.line1}
                  onChange={handleChange}
                />
              </div>
              <FormField
                label="City"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
              />
              <FormField
                label="State"
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
              />
              <FormField
                label="Pincode"
                name="address.pincode"
                value={form.address.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 3: ACADEMIC & ROLE */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                Professional Profile
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                  Department *
                </label>
                <select
                  name="department"
                  value={form.department || ""}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option
                      key={d._id}
                      value={d._id}
                      disabled={!d.isActive}
                      className={!d.isActive ? "text-slate-400 italic" : ""}
                    >
                      {d.departmentName}
                      {!d.isActive && " (Inactive)"}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                required
              />

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="permanent">Permanent</option>
                  <option value="guest">Guest</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <FormField
                label="Qualification"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
              />
              <FormField
                label="Experience (Years)"
                type="number"
                name="experienceYears"
                value={form.experienceYears}
                onChange={handleChange}
              />
              <FormField
                label="Total Leaves"
                type="number"
                name="totalLeaves"
                value={form.totalLeaves}
                onChange={handleChange}
              />

              <div className="md:col-span-2 lg:col-span-3">
                <FormField
                  label="Specialization (comma separated)"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: FINANCE & BANKING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Salary Column */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Salary Breakdown
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Base Salary"
                  name="salary.base"
                  value={form.salary.base}
                  onChange={handleChange}
                />
                <FormField
                  label="Allowances"
                  name="salary.allowances"
                  value={form.salary.allowances}
                  onChange={handleChange}
                />
                <FormField
                  label="Deductions"
                  name="salary.deductions"
                  value={form.salary.deductions}
                  onChange={handleChange}
                />
                <FormField
                  label="Net Salary"
                  name="salary.net"
                  value={netSalary.toFixed(2)} // show 2 decimal places
                  onChange={handleChange}
                  readOnly // user cannot edit
                />
              </div>
            </div>

            {/* Bank Column */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Bank Details
                </h3>
              </div>
              <div className="space-y-4">
                <FormField
                  label="Bank Name"
                  value={form.bankDetails.bankName}
                  name="bankDetails.bankName"
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Account No"
                    value={form.bankDetails.accountNo}
                    name="bankDetails.accountNo"
                    onChange={handleChange}
                  />
                  <FormField
                    label="IFSC"
                    value={form.bankDetails.ifsc}
                    name="bankDetails.ifsc"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PHOTO UPLOAD & SUBMIT */}
          <div className="pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Preview Container */}
              <div className="relative group">
                <div className="h-20 w-20 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                  {/* The Image tag starts hidden (opacity-0) and becomes visible via the inline JS below */}
                  <img
                    id="preview-img"
                    src="#"
                    alt="preview"
                    className="h-full w-full object-cover hidden"
                  />
                  <div id="placeholder-icon" className="text-slate-300">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={(e) => {
                    handleChange(e); // Keep your original function
                    const file = e.target.files[0];
                    if (file) {
                      const img = document.getElementById("preview-img");
                      const icon = document.getElementById("placeholder-icon");
                      img.src = URL.createObjectURL(file);
                      img.classList.remove("hidden");
                      icon.classList.add("hidden");
                    }
                  }}
                  className="block w-full text-xs text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-xl file:border-0
          file:text-xs file:font-bold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100 cursor-pointer transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full md:w-64 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading
                ? "Processing..."
                : mode === "edit"
                ? "Update Teacher Profile"
                : "Create Teacher Profile"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ======================================================
   REUSABLE COMPONENTS
====================================================== */

/* ======================================================
   TEACHER DETAILS DRAWER (FULL VERSION)
====================================================== */
function TeacherDetailsDrawer({ isOpen, onClose, data, loading }) {
  if (!isOpen) return null;

  const getSpecialization = (spec) => {
    try {
      if (Array.isArray(spec) && spec[0]) {
        const parsed = spec[0].startsWith("[") ? JSON.parse(spec[0]) : spec;
        return Array.isArray(parsed) ? parsed.join(", ") : parsed;
      }
      return "-";
    } catch (e) {
      return Array.isArray(spec) ? spec.join(", ") : spec || "-";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120]"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-[135] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Teacher Profile
            </h2>
            <p className="text-[10px] text-slate-400 font-bold">
              SYSTEM ID: {data?._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-20 text-center font-bold text-slate-400 animate-pulse text-sm uppercase tracking-widest">
              Fetching Records...
            </div>
          ) : data ? (
            <div className="pb-10">
              {/* Hero Profile Section */}
              <div className="bg-slate-50 p-8 flex flex-col items-center border-b">
                <div className="relative">
                  <img
                    src={data.profilePhoto || "/avatar.png"}
                    className="w-32 h-32 rounded-[2.5rem] object-cover shadow-xl border-4 border-white mb-4"
                    alt=""
                  />
                  <div
                    className={`absolute bottom-6 right-0 w-6 h-6 rounded-full border-4 border-white ${
                      data.isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  ></div>
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {data.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">
                    {data.designation}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                    {data.department?.departmentName || "General"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* 1. Identity & Registry */}
                <InfoGroup title="Identity & Registry">
                  <div className="grid grid-cols-3 gap-3">
                    <DetailCard
                      icon={Hash}
                      label="Teacher Code"
                      value={data.teacherCode}
                    />
                    <DetailCard
                      icon={User}
                      label="Employee ID"
                      value={data.employeeId}
                    />
                    <DetailCard
                      icon={Building2}
                      label="College Code"
                      value={data.collegeCode || "130"}
                    />
                  </div>
                </InfoGroup>

                {/* 2. Professional Details */}
                <InfoGroup title="Academic & Professional">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailCard
                      icon={Briefcase}
                      label="Employment"
                      value={data.employmentType}
                    />
                    <DetailCard
                      icon={GraduationCap}
                      label="Qualification"
                      value={data.qualification}
                    />
                    <DetailCard
                      icon={Globe}
                      label="Specialization"
                      value={getSpecialization(data.specialization)}
                    />
                    <DetailCard
                      icon={Briefcase}
                      label="Experience"
                      value={`${data.experienceYears || 0} Years`}
                    />
                  </div>
                </InfoGroup>

                {/* 3. Contact & Location */}
                <InfoGroup title="Communication">
                  <div className="space-y-3">
                    <DetailRow
                      icon={Mail}
                      label="Email Address"
                      value={data.email}
                    />
                    <DetailRow
                      icon={Phone}
                      label="Primary Phone"
                      value={data.phone}
                    />
                    <DetailRow
                      icon={Phone}
                      label="Alternate Phone"
                      value={data.alternatePhone || "Not Provided"}
                    />
                    <DetailRow
                      icon={Building2}
                      label="Residential Address"
                      value={
                        data.address
                          ? `${data.address.line1}, ${data.address.city}, ${data.address.state} - ${data.address.pincode}`
                          : "No address on file"
                      }
                    />
                  </div>
                </InfoGroup>

                {/* 4. Financials & Banking */}
                <InfoGroup title="Payroll & Banking">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-black text-emerald-600 uppercase">
                        Net Salary
                      </p>
                      <p className="text-lg font-black text-emerald-700">
                        ₹{data.salary?.net || "0"}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-500 uppercase">
                        Leaves Allowed
                      </p>
                      <p className="text-lg font-black text-slate-700">
                        {data.totalLeaves || "0"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 px-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">
                      Bank Account Info
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Bank:</span>
                      <span className="font-bold text-slate-700">
                        {data.bankDetails?.bankName || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">A/C No:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {data.bankDetails?.accountNo || "-"}
                      </span>
                    </div>
                  </div>
                </InfoGroup>

                {/* 5. Personal & System Info */}
                <InfoGroup title="Additional Information">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailCard
                      icon={Calendar}
                      label="Date of Birth"
                      value={formatDate(data.dob)}
                    />
                    <DetailCard
                      icon={Calendar}
                      label="Joining Date"
                      value={formatDate(data.joiningDate)}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-bold text-indigo-400 uppercase">
                        System Login ID
                      </p>
                      <p className="text-xs font-mono font-bold text-indigo-600">
                        {data.loginId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-indigo-400 uppercase">
                        Role
                      </p>
                      <p className="text-xs font-bold text-indigo-700 uppercase">
                        {data.role}
                      </p>
                    </div>
                  </div>
                </InfoGroup>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

/* ======================================================
   SUB-COMPONENTS FOR DRAWER
====================================================== */

function InfoGroup({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={12} className="text-indigo-500" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-slate-700 truncate">
        {value || "-"}
      </p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 p-1">
      <div className="mt-1 p-2 bg-slate-50 rounded-lg">
        <Icon size={14} className="text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700">{value || "-"}</p>
      </div>
    </div>
  );
}

// Ensure you also have the FormField and StatCard components if not defined
function FormField({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
        {label}
      </label>
      <input
        className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
        {...props}
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon = Users }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <h3 className="text-3xl font-black mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

// 3. SelectField for the Add Teacher Form
/* ======================================================
   FINAL REUSABLE COMPONENTS (Replace all duplicates with this)
====================================================== */

function SelectField({ label, required, children, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        {...props}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
      >
        {children || (
          <>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </>
        )}
      </select>
    </div>
  );
}

function TableLoader() {
  return [...Array(5)].map((_, i) => (
    <tr key={i}>
      <td colSpan="6" className="px-6 py-4 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
      </td>
    </tr>
  ));
}
