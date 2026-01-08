import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Handshake, 
  Zap, 
  ShieldCheck, 
  ArrowRightLeft, 
  Workflow,
  Sparkles,
  ChevronDown,
  Globe,
  Cpu
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from '../context/AuthContext';
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
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      
      {/* --- BACKGROUND ENGINE: SPLIT DESIGN --- */}
      <div className="absolute inset-0 flex">
        {/* Left Side: Traditional/Clean */}
        <div className="w-1/2 h-full bg-[#f8fbff]" />
        {/* Right Side: Modern/Deep */}
        <div className="w-1/2 h-full bg-slate-900" />
        
        {/* Central Blur Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full max-w-[1600px] px-12 grid lg:grid-cols-2 gap-0 items-center h-full">
        
        {/* LEFT: THE INSTITUTION */}
        <div className="flex flex-col items-start space-y-8 pr-12 animate-in slide-in-from-left-20 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
            <Globe size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Foundation</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Legacy of <br/> Excellence.
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              A century of academic prowess meeting the next generation of student management.
            </p>
          </div>

          {/* College Logo Hexagon */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-blue-600 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center p-4 border border-slate-100 transform group-hover:rotate-3 transition-transform duration-500">
              {collegeInfo?.collegeInfo?.logo? (
                <img src={collegeInfo.collegeInfo.logo} alt="College" className="w-full h-full object-contain" />
              ) : (
                <div className="font-black text-blue-600 text-3xl">INST</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: THE STARTUP ACCELERATION */}
        <div className="flex flex-col items-end text-right space-y-8 pl-12 animate-in slide-in-from-right-20 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Digital Intelligence</span>
            <Cpu size={14} className="text-blue-400" />
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Driven by <br/> <span className="text-blue-500">Innovation.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-md ml-auto">
              Real-time analytics, automated workflows, and instant connectivity for every student.
            </p>
          </div>

          {/* Startup Logo Hexagon */}
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-white rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="w-40 h-40 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex items-center justify-center p-4 border border-white/10 transform group-hover:-rotate-3 transition-transform duration-500">
              {logo ? (
                <img src={logo} alt="Startup" className="w-full h-full object-contain" />
              ) : (
                <Zap size={40} className="text-white fill-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- CENTRAL SYNERGY CORE (The Link) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div className="relative">
          {/* Animated Energy Rings */}
          <div className="absolute inset-0 -m-4 border border-blue-400/30 rounded-full animate-ping" />
          <div className="absolute inset-0 -m-8 border border-blue-500/20 rounded-full animate-pulse" />
          
          {/* Handshake Badge */}
          <div className="relative w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(37,99,235,0.5)] rotate-45 hover:rotate-0 transition-transform duration-700">
            <div className="-rotate-45 group-hover:rotate-0 transition-transform">
              <Handshake size={36} strokeWidth={1.5} />
            </div>
          </div>
        </div>
        
        <div className="mt-8 px-4 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.4em] backdrop-blur-xl">
           Live Collaboration
        </div>
      </div>

      {/* --- BOTTOM FLOATING STATS --- */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center gap-12 z-30 opacity-60">
        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AES-256 Encrypted</span>
        </div>
        <div className="flex items-center gap-3">
          <Workflow size={18} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deep Integration</span>
        </div>
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Smart Campus</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}