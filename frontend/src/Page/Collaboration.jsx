import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Handshake,
  Zap,
  ShieldCheck,
  ArrowRightLeft,
  Workflow,
  Sparkles,
  ChevronDown,
  Globe,
  Cpu,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;

export default function CollaborationHero({ collegeData, startupData }) {
  const college = collegeData || { name: "XYZ Institute", logo: null };
  const startup = startupData || { name: "TechStartup", logo: null };

  const [collegeInfo, setCollegeInfo] = useState(null);

  const { user } = useAuth();

  const fetchCollegeInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/college/info-limit`, {
        withCredentials: true,
      });

      setCollegeInfo(res.data.data);
    } catch (err) {
      console.error("Fetch college info failed", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCollegeInfo();
  }, [user]);

  return (
    <section className="relative min-h-screen lg:h-screen w-full overflow-hidden bg-white flex items-center justify-center">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 flex flex-col lg:flex-row">
        <div className="h-1/2 lg:h-full w-full lg:w-1/2 bg-[#f8fbff]" />
        <div className="h-1/2 lg:h-full w-full lg:w-1/2 bg-slate-900" />

        {/* Softer glow on mobile */}
        <div
          className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[240px] h-[240px]
        sm:w-[420px] sm:h-[420px]
        lg:w-[600px] lg:h-[600px]
        bg-blue-500/20 blur-[100px] rounded-full
      "
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        className="
    relative z-10
    w-full max-w-[1600px]
    px-6 sm:px-10 lg:px-12
    grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2
    items-center gap-10 lg:gap-0
  "
      >
        {/* ========== TOP / LEFT ========== */}
        <div
          className="
      flex flex-col items-center text-center
      lg:items-start lg:text-left
      space-y-5 pt-4 sm:pt-0 sm:space-y-8
    "
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
              Academic Foundation
            </span>
          </div>

          <h2
            className="
        text-3xl sm:text-4xl md:text-6xl lg:text-7xl
        font-black text-slate-900
        leading-tight sm:leading-[0.95]
      "
          >
            Legacy of <br /> Excellence.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-medium max-w-md">
            A century of academic prowess meeting the next generation of student
            management.
          </p>

          {/* College Logo */}
          <div className="mb-8 sm:mb-0 sm:mt-2">
            <div
              className="
          w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40
          bg-white rounded-[2rem]
          shadow-xl border border-slate-100
          flex items-center justify-center p-4
        "
            >
              {collegeInfo?.collegeInfo?.logo ? (
                <img
                  src={collegeInfo.collegeInfo.logo}
                  alt="College"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="font-black text-blue-600 text-2xl">INST</div>
              )}
            </div>
          </div>
        </div>

        {/* ========== BOTTOM / RIGHT ========== */}
        <div
          className="
      flex flex-col items-center text-center
      lg:items-end lg:text-right
      space-y-6 sm:space-y-8
    "
        >
          <div className="sm:mt-2 sm:hidden mt-12">
            <div
              className="
          w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40
          bg-white/10 backdrop-blur-xl
          rounded-[2rem] shadow-xl
          border border-white/10
          flex items-center justify-center p-4
        "
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Startup"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Zap className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white" />
              )}
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-400">
              Digital Intelligence
            </span>
            <Cpu className="w-3 h-3 text-blue-400" />
          </div>

          <h2
            className="
        text-3xl sm:text-4xl md:text-6xl lg:text-7xl
        font-black text-white
        leading-tight sm:leading-[0.95]
      "
          >
            Driven by <br />
            <span className="text-blue-500">Innovation.</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-400 font-medium max-w-md">
            Real-time analytics, automated workflows, and instant connectivity
            for every student.
          </p>

          <div className="inline-flex sm:hidden items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-400">
              Digital Intelligence
            </span>
            <Cpu className="w-3 h-3 text-blue-400" />
          </div>

          {/* Startup Logo */}
          <div className="mt-2 hidden sm:block">
            <div
              className="
          w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40
          bg-white/10 backdrop-blur-xl
          rounded-[2rem] shadow-xl
          border border-white/10
          flex items-center justify-center p-4
        "
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Startup"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Zap className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CENTER BADGE ================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className="
      w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24
      bg-blue-600 rounded-[1.5rem]
      flex items-center justify-center
      shadow-[0_0_40px_rgba(37,99,235,0.5)]
      rotate-45
    "
        >
          <Handshake className="w-5 h-5 sm:w-7 sm:h-7 text-white -rotate-45" />
        </div>
      </div>
    </section>
  );
}
