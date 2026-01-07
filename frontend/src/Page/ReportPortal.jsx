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
      console.log(res);

      setStep(3);
    } catch (error) {
      console.error("CREATE REPORT ERROR:", error);
      alert(error?.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        <Navbar />

        <div className="">{/* <CollegeInfo /> */}</div>
      </div>

      <main className="max-w-6xl mx-auto py-10 px-6">
        {step < 3 && (
          <div className=" mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 ">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                Submit <span className="text-indigo-600 italic">Report</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Step {step} of 2: Mission Parameters
              </p>
            </div>
            <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              {["Standard", "Medium", "Urgent"].map((level) => (
                <button
                  key={level}
                  onClick={() => setUrgency(level)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
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

        {step === 1 && (
          <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {Object.entries(sectors).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  setSector(key);
                  setStep(2);
                }}
                className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] text-left transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1"
              >
                <div
                  className={`${value.bg} ${value.accent} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-black mb-2">{value.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {value.desc}
                </p>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  Start Entry <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Media & Location Side */}
            <div className="lg:col-span-4 space-y-6">
              {/* FIXED IMAGE UPLOAD */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
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
                    className={`h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
                      uploadStatus === "success"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50"
                    }`}
                  >
                    {uploadStatus === "idle" && (
                      <div className="text-center">
                        <Camera
                          className="mx-auto text-slate-400 mb-2"
                          size={32}
                        />
                        <span className="text-xs font-bold text-slate-500">
                          Upload Photo
                        </span>
                      </div>
                    )}
                    {uploadStatus === "uploading" && (
                      <Loader2
                        className="animate-spin text-indigo-600"
                        size={32}
                      />
                    )}
                    {uploadStatus === "success" && (
                      <div className="relative w-full h-full p-2">
                        <img
                          src={selectedImage}
                          className="w-full h-full object-cover rounded-2xl"
                          alt="Preview"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedImage(null);
                            setUploadStatus("idle");
                          }}
                          className="absolute top-4 right-4 bg-red-500 text-white p-1 rounded-full shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* LOCATION TRACKER */}
            </div>

            {/* FORM AREA */}
            <div className="lg:col-span-8">
              <div
                className={`transition-all duration-500 border-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden ${urgencyStyles[urgency]}`}
              >
                <div className="bg-white/50 px-8 py-4 border-b border-inherit flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Field Report: {sector}
                  </span>
                  <Zap
                    size={16}
                    className={
                      urgency === "Urgent" ? "text-red-500" : "text-indigo-400"
                    }
                  />
                </div>

                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Title
                    </label>
                    <input
                      className="w-full bg-white/80 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:ring-4 ring-indigo-500/10 transition-all"
                      placeholder="Summarize the incident..."
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {sectors[sector].fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          {field}
                        </label>
                        <input
                          className="w-full bg-white/80 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all"
                          placeholder={field}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Detailed Description
                      </label>
                      <button
                        onClick={refineWithAI}
                        disabled={isAiRefining || !formData.description}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-30"
                      >
                        {isAiRefining ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Wand2 size={10} />
                        )}
                        Refine with Gemini
                      </button>
                    </div>
                    <textarea
                      rows="4"
                      className="w-full bg-white/80 border border-slate-200 rounded-[1.5rem] p-4 text-sm font-medium outline-none focus:ring-4 ring-indigo-500/10 transition-all"
                      placeholder="What exactly happened?"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <SendHorizontal size={18} /> Submit Ticket
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
              Dispatched
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Mission{" "}
              <span className="text-indigo-600 font-bold font-mono">
                {transactionCode}
              </span>{" "}
              is active. Our team has received your GPS coordinates and visual
              data.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({});
                  setUploadStatus("idle");
                  setUrgency("Standard");
                }}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                New Report
              </button>
              <button className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      <div>
        <Footer />
      </div>
    </div>
  );
}
