import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Users,
  GraduationCap,
  Search,
  MapPin ,
  AlertCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  Phone,
  Calendar,
  ArrowUpRight,
  Award ,
  ShieldAlert ,
  MoreHorizontal,
  ExternalLink,
  X,
  BookOpen,
  Mail,
  Upload,
  Hash,
  User,
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
       const dept = s.department?.shortCode || "N/A"; // Use shortCode or departmentName
    acc[dept] = (acc[dept] || 0) + 1;
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



      <CreateStudentModal
  isOpen={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
  onSuccess={() => window.location.reload()}
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


          <button
  onClick={() => setIsCreateOpen(true)}
  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition"
>
  <Users className="w-4 h-4" /> Add Student
</button>



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
                          src={s.profilePhoto}
                          alt={s.fullName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {s.fullName}
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
                          {s.department.shortCode}
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
                        <Phone className="w-3 h-3" /> {s.phone}
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


// ---------------- ADD STUDENT ---------------------





 function CreateStudentModal({ isOpen, onClose, onSuccess }) {
 const [form, setForm] = useState({
  fullName: "",
  rollNo: "",
  registrationNo: "",
  gender: "",
  dob: "",
  admissionYear: new Date().getFullYear().toString(),

  email: "",
  phone: "",
  alternatePhone: "",

  department: "",

  bloodGroup: "",
  nationality: "",
  ABC_Id: "",
  disability: "",

  fatherName: "",
  motherName: "",
  guardianName: "",
  guardianPhone: "",

  address_line1: "",
  address_city: "",
  address_state: "",
  address_pincode: "",

  emergency_name: "",
  emergency_relation: "",
  emergency_phone: "",

  last_board: "",
  last_examName: "",
  last_percentage: ""
});


  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments for the dropdown
  useEffect(() => {
    if (isOpen) {


      
      axios.get(`${import.meta.env.VITE_API_URL}/api/v1/department/all`, { withCredentials: true })
        .then(res => setDepartments(res.data.data || []))
        .catch(err => console.error("Dept fetch error", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Validation Check: Button remains disabled until these are filled
 const isFormValid =
  form.fullName &&
  form.rollNo &&
  form.gender &&
  form.dob &&
  form.admissionYear &&
  form.email &&
  form.phone &&
  form.department;


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

   const fd = new FormData();

fd.append("fullName", form.fullName);
fd.append("rollNo", form.rollNo);
fd.append("registrationNo", form.registrationNo);
fd.append("gender", form.gender);
fd.append("dob", form.dob);
fd.append("admissionYear", form.admissionYear);

fd.append("email", form.email);
fd.append("phone", form.phone);
fd.append("alternatePhone", form.alternatePhone);

fd.append("department", form.department);

fd.append("bloodGroup", form.bloodGroup);
fd.append("nationality", form.nationality);
fd.append("ABC_Id", form.ABC_Id);
fd.append("disability", form.disability);

fd.append("fatherName", form.fatherName);
fd.append("motherName", form.motherName);
fd.append("guardianName", form.guardianName);
fd.append("guardianPhone", form.guardianPhone);

// Address
fd.append("address[line1]", form.address_line1);
fd.append("address[city]", form.address_city);
fd.append("address[state]", form.address_state);
fd.append("address[pincode]", form.address_pincode);

// Emergency Contact
fd.append("emergencyContact[name]", form.emergency_name);
fd.append("emergencyContact[relation]", form.emergency_relation);
fd.append("emergencyContact[phone]", form.emergency_phone);

// Last Qualification
fd.append("lastQualification[board]", form.last_board);
fd.append("lastQualification[examName]", form.last_examName);
fd.append("lastQualification[percentage]", form.last_percentage);

if (avatar) fd.append("profilePhoto", avatar);

       

    try {
      setLoading(true);


      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/student/register`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
<>
  {/* Backdrop */}
  <div
    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150]"
    onClick={onClose}
  />

  {/* Slide-over Form */}
  <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-slate-50 shadow-2xl z-[200] flex flex-col animate-in slide-in-from-right duration-300">
    
    {/* Header */}
    <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-20 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Add New Student
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Academic Year 2025-26
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-full transition-all"
      >
        <X size={20} />
      </button>
    </div>

    {/* Form Body */}
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
      
      {/* Profile Image Card */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
        <div className="relative group cursor-pointer">
          <div className="w-28 h-28 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all duration-300">
            {avatarPreview ? (
              <img src={avatarPreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center text-slate-300">
                <Upload size={28} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
          />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-tighter">
          Upload Passport Size Photo
        </p>
      </div>

      {/* Grid Layout for Forms */}
      <div className="space-y-6">
        
        {/* Academic Profile */}
        <FormGroup title="Academic Profile" icon={GraduationCap}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required icon={User} placeholder="e.g. Rahul Sharma" />
            <Input label="Roll Number" name="rollNo" value={form.rollNo} onChange={handleChange} required icon={Hash} placeholder="e.g. 24BCA01" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input label="Registration No" name="registrationNo" value={form.registrationNo} onChange={handleChange} icon={BookOpen} placeholder="e.g. REG12345678" />
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm font-bold text-slate-700 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Dept</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.departmentName}</option>
                ))}
              </select>
            </div>
          </div>
        </FormGroup>

        {/* Personal & Contact */}
        <FormGroup title="Personal & Contact" icon={Phone}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="col-span-2">
              <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required icon={Calendar} />
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} placeholder="student@university.edu" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required icon={Phone} placeholder="+91 98765-43210" />
              <Input label="Admission Year" name="admissionYear" type="number" value={form.admissionYear} onChange={handleChange} required icon={Calendar} placeholder="2024" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input label="Alternate Phone" name="alternatePhone" value={form.alternatePhone} onChange={handleChange} icon={Phone} placeholder="Emergency backup" />
            <Input label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="e.g. O+ve" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
             <Input label="Nationality" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Indian" />
             <Input label="ABC ID" name="ABC_Id" value={form.ABC_Id} onChange={handleChange} placeholder="12-digit ABC ID" />
          </div>
          <div className="mt-4">
            <Input label="Disability" name="disability" value={form.disability} onChange={handleChange} placeholder="Type 'None' or describe briefly" />
          </div>
        </FormGroup>

        {/* Family Details */}
        <FormGroup title="Guardian Information" icon={Users}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Mr. Name" />
            <Input label="Mother Name" name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mrs. Name" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input label="Guardian Name" name="guardianName" value={form.guardianName} onChange={handleChange} placeholder="Legal Guardian if any" />
            <Input label="Guardian Phone" name="guardianPhone" value={form.guardianPhone} onChange={handleChange} placeholder="Primary contact for parents" />
          </div>
        </FormGroup>

        {/* Address */}
        <FormGroup title="Address Details" icon={MapPin}>
          <Input label="Address Line 1" name="address_line1" value={form.address_line1} onChange={handleChange} placeholder="Street, Building No, Area" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input label="City" name="address_city" value={form.address_city} onChange={handleChange} placeholder="City" />
            <Input label="State" name="address_state" value={form.address_state} onChange={handleChange} placeholder="State" />
            <Input label="Pincode" name="address_pincode" value={form.address_pincode} onChange={handleChange} placeholder="000000" />
          </div>
        </FormGroup>

        {/* Emergency Contact */}
        <FormGroup title="Emergency Protocol" icon={ShieldAlert}>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
                <Input label="Name" name="emergency_name" value={form.emergency_name} onChange={handleChange} placeholder="Name" />
            </div>
            <Input label="Relation" name="emergency_relation" value={form.emergency_relation} onChange={handleChange} placeholder="e.g. Brother" />
            <Input label="Phone" name="emergency_phone" value={form.emergency_phone} onChange={handleChange} placeholder="999..." />
          </div>
        </FormGroup>

        {/* Last Qualification */}
        <FormGroup title="Previous Education" icon={Award}>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
                <Input label="Board" name="last_board" value={form.last_board} onChange={handleChange} placeholder="CBSE / ISC" />
            </div>
            <Input label="Exam Name" name="last_examName" value={form.last_examName} onChange={handleChange} placeholder="Class 12th" />
            <Input label="Percentage" name="last_percentage" value={form.last_percentage} onChange={handleChange} placeholder="e.g. 88.5%" />
          </div>
        </FormGroup>
      </div>

      {/* Form validation notice */}
      {!isFormValid && (
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 border border-rose-100 rounded-2xl">
            <AlertCircle size={14} className="text-rose-500" />
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">
              Mandatory fields remaining
            </p>
        </div>
      )}

      {/* Submit Button Sticky Area */}
      <div className="pt-2 pb-10">
        <button
          disabled={loading || !isFormValid}
          className={`w-full py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-[0.96] flex items-center justify-center gap-3 ${
            isFormValid
              ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          {loading ? (
             <>
               <RefreshCw className="animate-spin" size={16} />
               Processing...
             </>
          ) : (
             "Register Student Profile"
          )}
        </button>
      </div>
    </form>
  </div>
</>

  );
}

// The Section Wrapper
function FormGroup({ title, icon: Icon, children }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-2">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Icon size={18} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// The Professional Input





const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-2 border-b pb-2 pt-4">
    <div className="h-4 w-1 bg-indigo-600 rounded-full"></div>
    <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
      {title}
    </h3>
  </div>
);



// Professional Input Component
function Input({ label, icon: Icon, required, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300`}
        />
      </div>
    </div>
  );
}


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

                <div className="flex items-center justify-center bg-gray-100/50 py-6 rounded-2xl ">
                  <img
                    src={data.student.profilePhoto}
                    alt=""
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50"
                  />
                </div>
                <div className="flex items-center gap-6">
                  
                <div className="grid grid-cols-2 gap-4">
                  
  <InfoBox label="Name" value={data.student?.fullName || "N/A"} icon={User} />
  <InfoBox label="Roll No" value={data.student?.rollNo || "N/A"} icon={Hash} />
  <InfoBox label="Email" value={data.student?.email || "N/A"} icon={Mail} />
  <InfoBox label="Mobile" value={data.student?.phone || "N/A"} icon={Phone} />
  <InfoBox label="Department" value={data.student?.department?.shortCode || "N/A"} icon={GraduationCap} />
  <InfoBox label="Admission Year" value={data.student?.admissionYear || "N/A"} icon={Calendar} />
  <InfoBox label="Blood Group" value={data.student?.bloodGroup || "N/A"} icon={Award} />
  <InfoBox label="Gender" value={data.student?.gender || "N/A"} icon={Users} />
</div>






                </div>


                {/* Address */}
<div className="grid grid-cols-1 gap-2 mt-4">
  <InfoBox label="Address Line 1" value={data.student?.address?.line1 || "N/A"} icon={MapPin} />
  <InfoBox label="City" value={data.student?.address?.city || "N/A"} icon={MapPin} />
  <InfoBox label="State" value={data.student?.address?.state || "N/A"} icon={MapPin} />
  <InfoBox label="Pincode" value={data.student?.address?.pincode || "N/A"} icon={MapPin} />
</div>





{/* Guardian / Emergency */}
<div className="grid grid-cols-2 gap-4 mt-4">
  <InfoBox label="Father Name" value={data.student?.fatherName || "N/A"} icon={User} />
  <InfoBox label="Mother Name" value={data.student?.motherName || "N/A"} icon={User} />
  <InfoBox label="Guardian Name" value={data.student?.guardianName || "N/A"} icon={User} />
  <InfoBox label="Guardian Phone" value={data.student?.guardianPhone || "N/A"} icon={Phone} />
  <InfoBox label="Emergency Contact Name" value={data.student?.emergencyContact?.name || "N/A"} icon={User} />
  <InfoBox label="Emergency Relation" value={data.student?.emergencyContact?.relation || "N/A"} icon={User} />
  <InfoBox label="Emergency Phone" value={data.student?.emergencyContact?.phone || "N/A"} icon={Phone} />
</div>

{/* Last Qualification */}
<div className="grid grid-cols-3 gap-4 mt-4">
  <InfoBox label="Board" value={data.student?.lastQualification?.board || "N/A"} icon={BookOpen} />
  <InfoBox label="Exam Name" value={data.student?.lastQualification?.examName || "N/A"} icon={BookOpen} />
  <InfoBox label="Percentage" value={data.student?.lastQualification?.percentage || "N/A"} icon={BookOpen} />
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
