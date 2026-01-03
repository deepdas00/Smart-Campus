import React, { useState } from "react";
import axios from "axios";
import { useRef } from "react";



import { useEffect } from "react";
import {
  School,
  Award,
  Radio,
  Save,
  Plus,
  Trash2,
  Edit3 ,
  MapPin,
  Camera ,
  Mail,
  ArrowRight ,
  CheckCircle2,
  Phone,
  User as UserIcon,
  Image as ImageIcon,
  Calendar,
  Hash,
  Sparkles,
  ChevronRight,
  Info,
  Globe,
  Bell,
  FileText,
  X,
} from "lucide-react";
import { Upload, Loader2 } from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
import CollegeInfo from "../Components/CollegeInfo";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

export default function SmartCollegeAdmin() {
  const [activeTab, setActiveTab] = useState("info");
  const API_URL = import.meta.env.VITE_API_URL;
  // --- DATA STATES ---
  const [collegeData, setCollegeData] = useState({
    code: "",
    name: "",
    email: "",
    personalContactName: "",
    regNumber: "",
    officePhone: "",
    address: "",
    principal: "",
    isAutonomous: true,
    universityName: "",
    naacGrade: "A",
    website: "",
    departments: [],
    description: "", // ✅ added
    logoFile: null, // ✅ added
    logoPreview: "", // ✅ added
  });

  const CATEGORY_ENUM = {
    EVENT: "event",
    ACADEMIC: "academic",
    SECURITY: "security",
    HOLIDAY: "holiday",
    OTHER: "other",
  };

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState({
    file: null,
    title: "",
    preview: "",
  });


  const [notificationLoading, setNotificationLoading] = useState(false);



const notificationFormRef = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [newDept, setNewDept] = useState("");

  const addDepartment = () => {
    if (!newDept.trim()) return;

    setCollegeData({
      ...collegeData,
      departments: [...collegeData.departments, newDept.trim()],
    });
    setNewDept("");
  };

  const deleteDepartment = (index) => {
    setCollegeData({
      ...collegeData,
      departments: collegeData.departments.filter((_, i) => i !== index),
    });
  };

  const uploadGalleryImage = async (file, title) => {
    if (!file || !title) {
      console.error("File or title missing", file, title);
      return;
    }

    const formData = new FormData();
    formData.append("image", newGalleryImage.file);
    formData.append("description", newGalleryImage.title);

    // Inspect formData content
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await api.post("/college/gallery", formData);
      console.log("Upload success", res.data);
    } catch (err) {
      console.error("Upload failed", err.response?.data || err);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await api.get("/college/gallery");
      console.log(res.data.data);

      setGallery(res.data.data);
    } catch (err) {
      console.error("Fetch gallery failed", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const deleteGalleryImage = async (id) => {
    try {
      await api.delete(`/college/gallery/${id}`);
      setGallery((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

const fetchNotifications = async () => {
  try {
    const res = await api.get("/college/notifications");
    const data = res.data.data.map((n) => ({
      ...n,
      expireAt: n.expireAt || null,
    }));
    console.log(res.data.data);
    
    setNotices(data);
  } catch (err) {
    console.error("Fetch notifications failed", err);
  }
};

  useEffect(() => {
    fetchNotifications();
  }, []);

  const [gallery, setGallery] = useState([
    {
      id: 1,
      title: "Main Campus",
      url: "https://images.unsplash.com/photo-1562774053-701939374585?w=600",
    },
    {
      id: 2,
      title: "Innovation Lab",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600",
    },
  ]);

  const [notices, setNotices] = useState([]);
  const [draftNotification, setDraftNotification] = useState(null);

  const gradeStyles = {
    "A++": "bg-emerald-500",
    "A+": "bg-teal-500",
    A: "bg-blue-600",
    "B++": "bg-indigo-600",
    B: "bg-orange-500",
    C: "bg-rose-600",
  };

  const mapCollegeDataToPayload = () => ({
    officialEmail: collegeData.email,
    collegeName: collegeData.name,
    address: collegeData.address,
    NAAC: collegeData.naacGrade,
    contactPersonName: collegeData.personalContactName,
    contactNumber: collegeData.officePhone,
    principalName: collegeData.principal,
    departmentName: collegeData.departments,
    description: collegeData.description || "",
    isAutonomous: collegeData.isAutonomous || false,
    universityName: collegeData.universityName || "",
    registrationNumber: collegeData.regNumber || "",
    description: collegeData.description || "",
  });

  useEffect(() => {
    fetchCollegeInfo();
  }, []);

  const fetchCollegeInfo = async () => {
    try {
      const res = await api.get("/college/info-full");
      const data = res.data.data;

      console.log(res.data.data);

      setCollegeData({
        code: data.collegeCode || "",
        name: data.collegeName || "",
        email: data.officialEmail || "",
        personalContactName: data.contactPersonName || "",
        officePhone: data.contactNumber || "",
        principal: data.principalName || "",
        naacGrade: data.NAAC || "A",
        address: data.address || "",
        departments: data.departmentName || [],
        description: data.description || "",
        website: data.website || "",
        isAutonomous: data.isAutonomous ?? true,
        universityName: data.universityName || "",
        logoPreview: data.logo ?? "",
        regNumber: data.registrationNumber || "",
      });
    } catch (err) {
      console.error("Fetch college info failed", err);
    }
  };




  
  const saveCollegeInfo = async () => {
    if (!collegeData.departments.length) {
      alert("At least one department is required");
      return;
    }

    try {
      setSaving(true);
      setSaveSuccess(false);

      const payload = mapCollegeDataToPayload();
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      if (collegeData.logoFile) {
        formData.append("logo", collegeData.logoFile);
      }

      await api.post("/college/info/createOrUpdate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSaveSuccess(true);

      // Auto-hide confirmation after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const formatCategory = (value) => {
    switch (value) {
      case "researchandlab":
        return "Research & Lab";
      case "housinganddorms":
        return "Housing & Dorms";
      case "groundandpublic":
        return "Ground & Public";
      default:
        return "General";
    }
  };

const createNotification = async (notificationPayload) => {
  setNotificationLoading(true);
  try {
    const formData = new FormData();
    formData.append("category", notificationPayload.category);
    formData.append("title", notificationPayload.title.trim());
    formData.append("description", notificationPayload.description.trim());
    if (notificationPayload.expireAt)
      formData.append("expireAt", notificationPayload.expireAt);
    if (notificationPayload.imageFile)
      formData.append("image", notificationPayload.imageFile);

    const res = await api.post("/college/notifications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setNotices((prev) => [res.data.data, ...prev]);
    return res.data.data;
  } catch (err) {
    console.error("Create notification failed", err.response?.data || err);
    throw err;
  }finally {
    setNotificationLoading(false);
  }
};

const updateNotification = async (id, notificationPayload) => {
  setNotificationLoading(true);
  try {
    const formData = new FormData();
    formData.append("category", notificationPayload.category);
    formData.append("title", notificationPayload.title.trim());
    formData.append("description", notificationPayload.description.trim());
    if (notificationPayload.expireAt)
      formData.append("expireAt", notificationPayload.expireAt);
    if (notificationPayload.imageFile)
      formData.append("image", notificationPayload.imageFile);

    // Properly log FormData content
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await api.patch(`/college/notifications/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setNotices((prev) =>
      prev.map((n) => (n._id === id ? res.data.data : n))
    );
    return res.data.data;
  } catch (err) {
    console.error("Update notification failed", err.response?.data || err);
    throw err;
  }finally
  {    setNotificationLoading(false); }
};



const deleteNotification = async (id) => {
  try {
    setNotificationLoading(true);
    await api.delete(`/college/notifications/${id}`);
    setNotices((prev) => prev.filter((n) => n._id !== id));
  } catch (err) {
    console.error("Delete notification failed", err.response?.data || err);
    throw err;
  } finally { 
    setNotificationLoading(false);
  }
};




const handleCreateNotification = async () => {
  if (!draftNotification.title.trim() || !draftNotification.description.trim()) {
    alert("Title and description are required");
    return;
  }

  try {
    await createNotification(draftNotification);
    setDraftNotification(null);
  } catch {
    alert("Failed to create notification");
  }
};




const handleUpdateNotification = async (id) => {
  try {
    await updateNotification(id, draftNotification);
    setDraftNotification(null);
  } catch {
    alert("Failed to update notification");
  }
};



const handleDeleteNotification = async (id) => {
  if (!confirm("Are you sure you want to delete this notification?")) return;

  try {
    await deleteNotification(id);
  } catch {
    alert("Failed to delete notification");
  }
};




// Create / Update button handler
const handleSaveDraftNotification = async () => {
  if (!draftNotification.title.trim() || !draftNotification.description.trim()) {
    alert("Title and description are required");
    return;
  }

  try {
    if (draftNotification._id) {
      // Update existing notification
      await updateNotification(draftNotification._id, draftNotification);
    } else {
      // Create new notification
      await createNotification(draftNotification);
    }
    setDraftNotification(null);
  } catch {
    alert("Notification save failed");
  }
};

// Cancel draft
const handleCancelDraftNotification = () => setDraftNotification(null);



// Open draft for edit
const handleEditNotification = (note) => {
  setDraftNotification(note);
// Smooth scroll to form
  setTimeout(() => {
    notificationFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);


};






  return (
    <div
      className="min-h-screen bg-white font-sans text-slate-900"
      style={{ zoom: 0.89 }}
    >
      <div className=" min-w-[90vw] mx-auto pb-5">
        {/* COMPACT HEADER */}
        <div className="flex justify-between items-center mb-6 bg-slate-900 p-6 rounded-[2rem] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-2xl text-white">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              College <span className="text-blue-400">Admin</span>
            </h1>
          </div>

          {saving && (
            <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
              <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-black text-blue-700 uppercase tracking-wider">
                  Processing...
                </span>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="text-green-600 text-4xl mb-4">✅</div>

                <h3 className="text-xl font-black uppercase mb-2">
                  Saved Successfully
                </h3>

                <p className="text-slate-600 font-medium mb-6">
                  College information has been updated successfully.
                </p>

                <button
                  onClick={() => setSaveSuccess(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold uppercase transition-all"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8">
          {[
            { id: "info", label: "College Profile", icon: School },
            { id: "visual", label: "Visual Vision", icon: ImageIcon },
            { id: "feed", label: "Live Broadcast", icon: Radio },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl font-bold transition-all border-2 ${
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                  : "bg-white border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
              }`}
            >
              <tab.icon size={20} />
              <span className="text-base uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* --- 1. COLLEGE PROFILE SECTION --- */}
        {activeTab === "info" && (
          <div className="grid lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-8 bg-[#bbcbff] p-8 rounded-[2.5rem] border border-blue-100 shadow-inner">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8 text-blue-800">
                <Info size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Institutional Identity
                </h2>
              </div>

              {/* Identity Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <InputGroup
                  label="College Code"
                  readOnly={true}
                  icon={<Hash size={20} />}
                  value={collegeData.code}
                  onChange={(v) => setCollegeData({ ...collegeData, code: v })}
                />
                <InputGroup
                  label="Full College Name"
                  readOnly={true}
                  icon={<School size={20} />}
                  value={collegeData.name}
                  onChange={(v) => setCollegeData({ ...collegeData, name: v })}
                />
                <InputGroup
                  label="Official Email"
                  icon={<Mail size={20} />}
                  value={collegeData.email}
                  onChange={(v) => setCollegeData({ ...collegeData, email: v })}
                />
                <InputGroup
                  label="Principal/Dean"
                  icon={<UserIcon size={20} />}
                  value={collegeData.principal}
                  onChange={(v) =>
                    setCollegeData({ ...collegeData, principal: v })
                  }
                />
                <InputGroup
                  label="Personal Contact Name"
                  icon={<UserIcon size={20} />}
                  value={collegeData.personalContactName}
                  onChange={(v) =>
                    setCollegeData({ ...collegeData, personalContactName: v })
                  }
                />
                <InputGroup
                  label="Registration Number"
                  readOnly={true}
                  icon={<FileText size={20} />}
                  value={collegeData.regNumber}
                  onChange={(v) =>
                    setCollegeData({ ...collegeData, regNumber: v })
                  }
                />
                <InputGroup
                  label="Contact Number"
                  icon={<Phone size={20} />}
                  value={collegeData.officePhone}
                  onChange={(v) =>
                    setCollegeData({ ...collegeData, officePhone: v })
                  }
                />

                <div className="">
                  <label className="text-xs font-black uppercase text-blue-600 mb-2 block tracking-widest">
                    College Logo
                  </label>

                  <div className="flex items-center gap-4">
                    {collegeData.logoPreview && (
                      <img
                        src={collegeData.logoPreview}
                        alt="College Logo"
                        className="h-20 w-20 rounded-xl object-cover border"
                      />
                    )}

                    <label className="cursor-pointer bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase shadow-lg hover:bg-blue-500">
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          setCollegeData((prev) => ({
                            ...prev,
                            logoFile: file,
                            logoPreview: URL.createObjectURL(file),
                          }));
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Departments Section */}
              <div className="mt-8">
                <label className="text-xs font-black uppercase text-blue-600 mb-3 block tracking-widest">
                  Departments
                </label>

                {/* Department Addition UI */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter department name..."
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                    className="flex-1 bg-white/80 p-3 px-5 rounded-xl border-2 border-transparent focus:border-blue-400 outline-none text-sm font-bold shadow-sm"
                  />
                  <button
                    onClick={addDepartment}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Display Departments: 4 per row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {collegeData.departments.map((dept, index) => (
                    <div
                      key={index}
                      className="group relative bg-white/70 border border-blue-200 py-3 px-4 rounded-xl text-[10px] md:text-xs font-black text-blue-800 flex items-center justify-center text-center uppercase shadow-sm hover:bg-white transition-all"
                    >
                      {dept}

                      {/* The Delete Button */}
                      <button
                        onClick={() => deleteDepartment(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={12} strokeWidth={4} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mt-8">
                <label className="text-xs font-black uppercase text-blue-600 mb-2 block tracking-widest">
                  Campus Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4 text-blue-500"
                    size={20}
                  />
                  <textarea
                    value={collegeData.address}
                    onChange={(e) =>
                      setCollegeData({
                        ...collegeData,
                        address: e.target.value,
                      })
                    }
                    className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none text-base font-medium h-24 shadow-sm"
                  />
                </div>
                <div className="relative">
                  <label className="text-xs font-black uppercase text-blue-600 mb-2 block tracking-widest mt-6">
                  Campus Description
                </label>
                  <Info 
                    className="absolute left-4 top-10 text-blue-500"
                    size={20}
                  />
                  <textarea
                    value={collegeData.description}
                    onChange={(e) =>
                      setCollegeData({
                        ...collegeData,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none text-base font-medium h-24 shadow-sm "
                  />
                </div>
                <div className="w-full mt-5 flex items-center justify-center">
                  <button
                    onClick={saveCollegeInfo}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase hover:bg-blue-500 transition-all shadow-lg disabled:opacity-70"
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save size={18} /> Save Changes
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-md border-b-4 border-blue-600">
                <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest text-center">
                  Affiliation Status
                </h3>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                  <button
                    onClick={() =>
                      setCollegeData((prev) => ({
                        ...prev,
                        isAutonomous: true,
                        universityName: "", // 🔥 clear university when autonomous
                      }))
                    }
                    className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all ${
                      collegeData.isAutonomous
                        ? "bg-white shadow text-blue-600"
                        : "text-slate-400"
                    }`}
                  >
                    Autonomous
                  </button>

                  <button
                    onClick={() =>
                      setCollegeData((prev) => ({
                        ...prev,
                        isAutonomous: false,
                      }))
                    }
                    className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all ${
                      !collegeData.isAutonomous
                        ? "bg-white shadow text-blue-600"
                        : "text-slate-400"
                    }`}
                  >
                    Affiliated
                  </button>
                </div>
                {!collegeData.isAutonomous && (
                  <input
                    placeholder="University Name"
                    value={collegeData.universityName}
                    onChange={(e) =>
                      setCollegeData({
                        ...collegeData,
                        universityName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 p-4 rounded-xl text-base border border-slate-200 outline-none mb-4 font-bold text-center"
                  />
                )}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-4 text-center">
                    NAAC Grade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(gradeStyles).map((grade) => (
                      <button
                        key={grade}
                        onClick={() =>
                          setCollegeData({ ...collegeData, naacGrade: grade })
                        }
                        className={`py-2 rounded-lg text-xs font-black transition-all ${
                          collegeData.naacGrade === grade
                            ? `${gradeStyles[grade]} text-white scale-105 shadow-md`
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-2xl font-black italic mb-2 tracking-tight">
                    {collegeData.name}
                  </h4>
                  <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-lg font-black uppercase">
                    Grade: {collegeData.naacGrade}
                  </div>
                </div>
                <School
                  size={100}
                  className="absolute -bottom-4 -right-4 text-white/10 rotate-12"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- 2. VISUAL VISION (GALLERY) --- */}
        {activeTab === "visual" && (
          <div
            style={{ zoom: 0.92 }}
            className="bg-[#c3f7d3] p-8 rounded-[2.5rem] border border-emerald-100 shadow-inner animate-fadeIn"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-emerald-800">
                <ImageIcon size={24} />
                upload Gallery Image
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Campus Gallery
                </h2>
              </div>
              <input
                type="file"
                hidden
                id="galleryUpload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const title = prompt("Enter image title");
                  uploadGalleryImage(file, title);
                }}
              />

              <button
                onClick={() => setShowGalleryModal(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase flex items-center gap-2 hover:bg-emerald-500 shadow-lg"
              >
                <Plus size={18} /> Add Photo
              </button>
            </div>
            {showGalleryModal && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 w-full">
                {/* Light background overlay */}
                <div
                  className="absolute inset-0 bg-white/80 backdrop-blur-xl transition-all duration-700"
                  onClick={() =>
                    !isUploading && !isSuccess && setShowGalleryModal(false)
                  }
                />

                <div className="relative w-full max-w-xl transition-all duration-500">
                  {!isSuccess ? (
                    /* --- UPLOAD FORM --- */
                    <div className="bg-white border border-violet-200 rounded-[2rem] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                      {/* Decorative Header Bar */}
                      <div className="h-2 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />

                      <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
                              Upload Media
                            </h2>
                            <div className="h-1 w-12 bg-violet-500 mt-1" />
                          </div>
                          <button
                            onClick={() => setShowGalleryModal(false)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-white hover:bg-red-500/80 transition-all"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Content Area */}
                        <div className="space-y-6">
                          {/* Image Preview / Drop Zone */}
                          <div className="relative group">
                            {!newGalleryImage.preview ? (
                              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-300 rounded-3xl cursor-pointer bg-slate-50 hover:border-violet-400 transition-all group">
                                <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <Upload
                                    className="text-violet-600"
                                    size={32}
                                  />
                                </div>
                                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
                                  Drag & Drop Image
                                </p>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setNewGalleryImage({
                                      ...newGalleryImage,
                                      file,
                                      preview: URL.createObjectURL(file),
                                    });
                                  }}
                                />
                              </label>
                            ) : (
                              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-violet-300 shadow-lg">
                                <img
                                  src={newGalleryImage.preview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                {!isUploading && (
                                  <button
                                    onClick={() =>
                                      setNewGalleryImage({
                                        ...newGalleryImage,
                                        preview: "",
                                        file: null,
                                      })
                                    }
                                    className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-xl hover:scale-110 transition-transform shadow-md"
                                  >
                                    <X size={18} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Input Section */}
                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="IMAGE TITLE / CAPTION"
                              value={newGalleryImage.title}
                              onChange={(e) =>
                                setNewGalleryImage({
                                  ...newGalleryImage,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-6 py-4 bg-white border border-slate-300 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-slate-900 font-mono tracking-tight"
                            />

                            <button
                              disabled={isUploading || !newGalleryImage.file}
                              onClick={async () => {
                                setIsUploading(true);
                                const formData = new FormData();
                                formData.append("image", newGalleryImage.file);
                                formData.append(
                                  "description",
                                  newGalleryImage.title
                                );
                                try {
                                  const res = await api.post(
                                    "/college/gallery",
                                    formData
                                  );
                                  setGallery((prev) => [
                                    ...prev,
                                    res.data.data,
                                  ]);
                                  setIsSuccess(true);
                                } catch (err) {
                                  alert("Error uploading");
                                } finally {
                                  setIsUploading(false);
                                }
                              }}
                              className="w-full py-5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:translate-y-1"
                            >
                              {isUploading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                "Initialize Upload"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* --- SUCCESS PHASE (LIGHT) --- */
                    <div className="bg-white border-2 border-green-400 rounded-[2.5rem] p-12 text-center shadow-xl animate-in zoom-in-95 duration-500">
                      <div className="inline-flex p-5 rounded-3xl bg-green-100 mb-6 border border-green-300">
                        <CheckCircle2 size={60} className="text-green-500" />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tight mb-2">
                        Success
                      </h2>
                      <p className="text-slate-500 font-medium mb-8">
                        Data successfully synchronized with gallery.
                      </p>

                      <button
                        onClick={() => {
                          setShowGalleryModal(false);
                          setIsSuccess(false);
                          setNewGalleryImage({
                            file: null,
                            title: "",
                            preview: "",
                          });
                        }}
                        className="px-10 py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform active:scale-95"
                      >
                        Return Home
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((img, idx) => (
                <div
                  key={img.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={img.image} // ✅ dynamic image URL
                    alt={img.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 bg-white">
                    <p>
                      {idx + 1}. {img.description}
                    </p>
                    <button
                      onClick={() => deleteGalleryImage(img._id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. LIVE BROADCAST (NOTIFICATIONS) --- */}
        {activeTab === "feed" && (
          <div ref={notificationFormRef} className="bg-[#ffe0ba] p-8 rounded-[2.5rem] border border-orange-100 shadow-inner animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-orange-800">
                <Bell size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Announcement Center
                </h2>
              </div>
              <button
                onClick={() =>
                  setDraftNotification({
                    category: CATEGORY_ENUM.EVENT,
                    title: "",
                    description: "",
                    expireAt: "",
                  })
                }
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase flex items-center gap-2 hover:bg-orange-500 shadow-lg"
              >
                <Plus size={18} /> New Feed
              </button>
            </div>

            {/* Notification Form Inline */}
{draftNotification && (
  <div className="relative overflow-hidden bg-white border-2 border-orange-200 rounded-[2rem] shadow-lg transition-all mb-12">
    
    {/* Top Status Bar */}
    <div className="bg-orange-600 py-3 px-6 flex justify-between items-center rounded-t-[1.75rem]">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        <span className="text-[10px] font-black text-white uppercase tracking-widest">
          {draftNotification._id ? "Edit_Protocol" : "Create_New_Broadcast"}
        </span>
      </div>
      <button 
        onClick={handleCancelDraftNotification} 
        className="text-white hover:text-orange-200 transition-colors"
      >
        <X size={18} />
      </button>
    </div>

    <div className="grid lg:grid-cols-12">
      {/* Sidebar */}
      <div className="lg:col-span-4 p-8 bg-orange-50/50 space-y-6 border-r border-orange-100 rounded-bl-[2rem] rounded-tl-[0rem]">
        
        {/* Category */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-3 bg-orange-400 rounded-full"></div> Protocol_Type
          </label>
          <select
            value={draftNotification.category}
            onChange={(e) => setDraftNotification({ ...draftNotification, category: e.target.value })}
            className="w-full bg-white px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500 outline-none font-black text-xs text-orange-700 uppercase transition cursor-pointer"
          >
            <option value={CATEGORY_ENUM.EVENT}>Event_Log</option>
            <option value={CATEGORY_ENUM.ACADEMIC}>Academic_Sync</option>
            <option value={CATEGORY_ENUM.SECURITY}>Security_Alert</option>
            <option value={CATEGORY_ENUM.HOLIDAY}>Holiday_Node</option>
            <option value={CATEGORY_ENUM.OTHER}>General_Data</option>
          </select>
        </div>

        {/* Expiry */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-3 bg-orange-400 rounded-full"></div> Auto_Purge_Date
          </label>
          <input
            type="date"
            value={draftNotification.expireAt || ""}
            onChange={(e) => setDraftNotification({ ...draftNotification, expireAt: e.target.value })}
            className="w-full bg-white px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500 outline-none font-black text-xs text-orange-700 transition"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-3 bg-orange-400 rounded-full"></div> Visual_Asset
          </label>
          <div
            onClick={() => document.getElementById('imagePicker').click()}
            className="group relative aspect-video w-full bg-white border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center overflow-hidden hover:border-orange-500 transition cursor-pointer"
          >
            {draftNotification.imagePreview ? (
              <>
                <img src={draftNotification.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">
                  Replace Asset
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <Camera size={24} className="text-orange-300 mx-auto mb-2 group-hover:text-orange-500 transition-colors" />
                <span className="text-[9px] font-black text-orange-400 uppercase">Attach Media</span>
              </div>
            )}
          </div>
          <input
            id="imagePicker"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if(file) setDraftNotification({...draftNotification, imageFile: file, imagePreview: URL.createObjectURL(file)});
            }}
          />
        </div>
      </div>

      {/* Main Body */}
      <div className="lg:col-span-8 p-10 flex flex-col">
        <div className="space-y-6 flex-grow">
          <div className="space-y-2">
            <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest">Transmission_Title</span>
            <input
              placeholder="ENTER BROADCAST HEADING..."
              value={draftNotification.title}
              onChange={(e) => setDraftNotification({ ...draftNotification, title: e.target.value })}
              className="text-3xl font-black text-orange-900 placeholder:text-orange-200 outline-none w-full bg-transparent italic uppercase tracking-tight"
            />
          </div>

          <div className="space-y-2 flex-grow">
            <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest">Signal_Body</span>
            <textarea
              placeholder="Detailed announcement parameters..."
              value={draftNotification.description}
              onChange={(e) => setDraftNotification({ ...draftNotification, description: e.target.value })}
              className="w-full h-full min-h-[200px] text-lg text-orange-700 placeholder:text-orange-300 outline-none bg-transparent resize-none leading-relaxed font-medium"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-orange-100 flex items-center justify-between">
          <button
            onClick={handleCancelDraftNotification}
            className="text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-red-500 transition-colors"
          >
            Terminate_Draft
          </button>
          <button
            onClick={handleSaveDraftNotification}
            className="group flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white pl-6 pr-4 py-3 rounded-2xl font-black text-[11px] tracking-widest uppercase transition-all shadow-lg"
          >
            {draftNotification._id ? "Update_Protocol" : "Execute_Broadcast"}
            <span className="bg-white/20 p-2 rounded-lg">
              <ArrowRight size={16} strokeWidth={3} />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}



{notificationLoading && (
  <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
    <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl flex items-center gap-4">
      <Loader2 className="animate-spin text-orange-600" size={32} />
      <span className="font-black text-orange-700 uppercase tracking-wider">
        Processing Broadcast...
      </span>
    </div>
  </div>
)}




         <div className="grid md:grid-cols-2 gap-6 mt-12">
{notices.map((note) => (
  <div
    key={note._id}
    className="group relative bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-300 flex items-center gap-6 p-4 mb-4 overflow-hidden"
  >
    {/* Left Accent Bar - Aesthetic Unique Touch */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-blue-500 transition-colors" />

    {/* 1. Image/Thumbnail Section - Compact Square */}
    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
      {note.pic ? (
        <img 
          src={note.pic} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          alt="" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-50">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">No Media</span>
        </div>
      )}
    </div>

    {/* 2. Content Section - Expanded */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 rounded-md border border-blue-100">
          {note.category}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase">
          <div className={`w-1.5 h-1.5 rounded-full ${note.expireAt ? 'bg-amber-400' : 'bg-emerald-500'}`} />
          {note.expireAt ? `Expires: ${new Date(note.expireAt).toLocaleDateString()}` : "Permanent"}
        </span>
      </div>
      
      <h4 className="text-lg font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
        {note.title}
      </h4>
      
      <p className="text-sm text-slate-500 line-clamp-1 mt-1 font-medium">
        {note.description}
      </p>
    </div>

    {/* 3. Action Section - Clean & Separated */}
    <div className="flex items-center gap-2 pl-6 border-l border-slate-100">
      <button
        onClick={() => handleEditNotification(note)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
        title="Edit Notice"
      >
        <Edit3 size={16} />
      </button>
      
      <button
        onClick={() => handleDeleteNotification(note._id)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
        title="Delete Notice"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
))}
</div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
}

// Reusable Input Component with improved font sizing

function InputGroup({ label, icon, value, onChange, readOnly }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-black uppercase text-blue-600 ml-1 tracking-widest">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly} // 🔹 passed from props
          className={`w-full bg-white p-3.5 pl-12 rounded-xl border-2 border-slate-200 focus:border-blue-400 outline-none font-bold text-base ${
            readOnly ? "bg-slate-100 cursor-not-allowed" : ""
          }`}
        />
      </div>
    </div>
  );
}
