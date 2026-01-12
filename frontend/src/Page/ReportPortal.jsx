import React, { useState, useEffect } from "react";
import {
  Building2,
  FlaskConical,
  Home,
  Trees,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  ArrowLeft,
  SendHorizontal,
  Camera,
  Wand2,
  Image as ImageIcon,
  Zap,
  ShieldCheck,
  Globe,
  Navigation,
  X,
} from "lucide-react";
import axios from "axios";
import profile from "../assets/profile.png";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
// import CollegeInfo from "../Components/CollegeInfo";
import ProfileSidebar from "../Components/ProfileSidebar";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function EduReportPortal() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [sector, setSector] = useState("Academic");
  const [urgency, setUrgency] = useState("Standard");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [transactionCode, setTransactionCode] = useState(null);
  // Image Upload Logic
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");

  const categoryMap = {
    Academic: "researchandlab",
    Residential: "housinganddorms",
    Campus: "groundandpublic",
  };

  const priorityMap = {
    Standard: "standard",
    Medium: "medium",
    Urgent: "urgent",
  };

  // Location Logic
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: "Detecting...",
  });
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    building: "",
    room: "",
    zone: "",
    labId: "",
    floor: "",
    wing: "",
    equipmentId: "",
  });

  // Urgency Background Mapping
  const urgencyStyles = {
    Standard: "bg-slate-200 border-slate-400",
    Medium: "bg-amber-200/50 border-amber-400",
    Urgent: "bg-red-200/50 border-red-400",
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sectors = {
    Academic: {
      icon: <FlaskConical size={24} />,
      label: "Research & Labs",
      fields: ["building", "room", "labId", "equipmentId"],
      desc: "Precision equipment, lab safety, or classroom tech issues.",
      accent: "text-blue-600",
      bg: "bg-blue-100",
    },
    Residential: {
      icon: <Home size={24} />,
      label: "Housing & Dorms",
      fields: ["building", "wing", "floor", "room"],
      desc: "Living space maintenance, plumbing, or residential security.",
      accent: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    Campus: {
      icon: <Trees size={24} />,
      label: "Grounds & Public",
      fields: ["zone", "building"],
      desc: "Outdoor lighting, walkways, or sports facility repairs.",
      accent: "text-purple-600",
      bg: "bg-purple-100",
    },
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus("uploading");
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        setSelectedImage(reader.result); // for preview
        setUploadStatus("success");
      }, 1000);
    };
    reader.readAsDataURL(file);
  };



  useEffect(() => {
  if (step === 3) {
    const t = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);
    return () => clearTimeout(t);
  }
}, [step]);





  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(4),
          lng: position.coords.longitude.toFixed(4),
          address: "Main Campus - Sector 4",
        });
        setIsLocating(false);
      });
    }
  };

  const refineWithAI = () => {
    if (!formData.description) return;
    setIsAiRefining(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        description: `[AI REFINED ASSESSMENT]\nISSUE: ${
          prev.title
        }\nSTATUS: ${urgency} priority dispatch required.\nCONTEXT: Structural/Electrical safety check requested for ${
          prev.building || "specified site"
        }.\n\nORIGINAL LOG: ${prev.description}`,
      }));
      setIsAiRefining(false);
    }, 1500);
  };

  const handleInputChange = (field, val) =>
    setFormData((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // BASIC VALIDATION
      if (!formData.title || !formData.description) {
        alert("Title and description are required");
        return;
      }

      const payload = new FormData();

      // REQUIRED FIELDS
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", categoryMap[sector]); // ✅ FIX
      payload.append("priority", priorityMap[urgency]); // ✅ FIX

      // OPTIONAL FIELDS (SAFE)
      if (formData.building) payload.append("building", formData.building);
      if (formData.room) payload.append("room", formData.room);
      if (formData.zone) payload.append("zone", formData.zone);

      // IMAGE (ONLY IF UPLOADED)
      if (selectedImageFile) {
        payload.append("image", selectedImageFile);
      }

      const res = await axios.post(
        `${API_URL}/api/v1/reports/createreport`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setTransactionCode(res.data.data.transactionCode);

      setStep(3);
    } catch (error) {
      console.error("CREATE REPORT ERROR:", error);
      alert(error?.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className={`min-h-screen transition-colors duration-700 font-sans text-slate-900 ${
          urgency === "Urgent"
            ? "bg-red-300/50"
            : urgency === "Medium"
            ? "bg-amber-300/30"
            : "bg-[#F8FAFC]"
        }`}
      >
        {/* Navbar */}
        <div>
          {/* Header */}

          <div className="">{/* <CollegeInfo /> */}</div>
        </div>

        <main className="max-w-6xl mx-auto py-6 px-3 md:py-10 md:px-6">
          {/* HEADER */}
          {step < 3 && (
            <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
                  Submit <span className="text-indigo-600 italic">Report</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm md:text-base">
                  Step {step} of 2: Mission Parameters
                </p>
              </div>

              {/* URGENCY SELECTOR */}
              <div className="flex gap-1 justify-between items-center md:gap-2 bg-white p-1 md:p-2 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                {["Standard", "Medium", "Urgent"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setUrgency(level)}
                    className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all
              ${
                urgency === level
                  ? level === "Urgent"
                    ? "bg-red-600 text-white"
                    : level === "Medium"
                    ? "bg-amber-500 text-white"
                    : "bg-indigo-600 text-white"
                  : "bg-transparent text-slate-400 hover:bg-slate-50"
              }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 – SECTOR SELECTION */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-in fade-in duration-500">
              {Object.entries(sectors).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSector(key);
                    setStep(2);
                  }}
                  className="group bg-white border border-slate-200 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-left transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1"
                >
                  <div
                    className={`${value.bg} ${value.accent} w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-black mb-2">
                    {value.label}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 md:mb-6">
                    {value.desc}
                  </p>
                  <div className="flex w-full sm:items-center gap-2 text-indigo-600 font-bold text-sm items-end justify-end">
                    Start Entry <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2 – FORM */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in slide-in-from-bottom-4 duration-500">
              {/* LEFT PANEL */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-sm">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 block">
                    Evidence Attachment
                  </label>

                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className={`h-40 md:h-48 border-2 border-dashed rounded-2xl md:rounded-3xl flex items-center justify-center transition-all
                ${
                  uploadStatus === "success"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50"
                }`}
                    >
                      {uploadStatus === "idle" && (
                        <div className="text-center">
                          <Camera
                            className="mx-auto text-slate-400 mb-2"
                            size={28}
                          />
                          <span className="text-xs font-bold text-slate-500">
                            Upload Photo
                          </span>
                        </div>
                      )}

                      {uploadStatus === "uploading" && (
                        <Loader2
                          className="animate-spin text-indigo-600"
                          size={28}
                        />
                      )}

                      {uploadStatus === "success" && (
                        <div className="relative w-full h-full p-2">
                          <img
                            src={selectedImage}
                            className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                            alt="Preview"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImage(null);
                              setUploadStatus("idle");
                            }}
                            className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL – FORM */}
              <div className="lg:col-span-8">
                <div
                  className={`border-2 rounded-2xl md:rounded-[2.5rem] shadow-xl overflow-hidden ${urgencyStyles[urgency]}`}
                >
                  <div className="bg-white/50 px-4 md:px-8 py-3 md:py-4 border-b border-inherit flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Field Report: {sector}
                    </span>
                    <Zap
                      size={16}
                      className={
                        urgency === "Urgent"
                          ? "text-red-500"
                          : "text-indigo-400"
                      }
                    />
                  </div>

                  <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                    <input
                      className="w-full bg-white border border-slate-200 rounded-xl md:rounded-2xl p-3 md:p-4 font-bold"
                      placeholder="Summarize the incident..."
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {sectors[sector].fields.map((field) => (
                        <input
                          key={field}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold"
                          placeholder={field}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                        />
                      ))}
                    </div>

                    <textarea
                      rows={4}
                      className="w-full bg-white border border-slate-200 rounded-xl md:rounded-[1.5rem] p-3 md:p-4 text-sm"
                      placeholder="What exactly happened?"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />

                    <div className="flex flex-col md:flex-row gap-3 pt-4">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 bg-slate-900 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>Submit Ticket</>
                        )}
                      </button>

                      <button
                        onClick={() => setStep(1)}
                        className="p-3 md:p-4 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-slate-400 justify-center items-center flex"
                      >
                        <ArrowLeft size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}




          {/* STEP 3 – SUCCESS */}
{step === 3 && (
  <div className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in-95 duration-500">
    
    {/* Icon */}
    <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-inner">
      <CheckCircle2 size={48} className="text-emerald-600" />
    </div>

    {/* Title */}
    <h2 className="text-3xl font-black text-slate-900 mb-2">
      Report Submitted Successfully
    </h2>

    {/* Subtitle */}
    <p className="text-slate-500 font-medium max-w-md mb-6">
      Your incident has been logged and forwarded to the campus administration.
      Our team will review it shortly.
    </p>

    {/* Transaction Code */}
    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-8">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        Transaction ID
      </p>
      <p className="font-mono text-lg font-bold text-indigo-600">
        {transactionCode}
      </p>
    </div>

    {/* Actions */}
    <div className="flex gap-4">
      <button
        onClick={() => {
          setStep(1);
          setFormData({
            title: "",
            description: "",
            building: "",
            room: "",
            zone: "",
            labId: "",
            floor: "",
            wing: "",
            equipmentId: "",
          });
          setSelectedImage(null);
          setSelectedImageFile(null);
          setUploadStatus("idle");
          setUrgency("Standard");
          setSector("Academic");
        }}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition"
      >
        Submit Another Report
      </button>

      <Link
        to="/report-history"
        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
)}





        </main>

        <div>
          <Footer />
        </div>
      </div>

    </>
  );
}
