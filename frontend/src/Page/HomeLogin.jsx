import React, { useRef, useState } from "react";
import {
  Camera,
  Coffee,
  BookOpen,
  User,
  ShoppingBag,
  AlertTriangle,
  Bell,
  Sparkles,
  Trophy,
  Cpu,
  Gamepad2,
  Zap,
  Shield,
  BarChart3,
  ChevronRight,
  ArrowRight,
  Globe,
  Layers,
} from "lucide-react";

import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar/Navbar";
import CollegeInfo from "../Components/CollegeInfo";
import HomepageHeaderCollegeInfo from "../Components/HomepageHeaderCollegeInfo";
import Collaboration from "./Collaboration";

export default function HomeLogin() {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const notices = [
    { id: 1, title: "Semester Results Out", date: "26 Dec", type: "Exam" },
    { id: 2, title: "Hackathon 2025", date: "24 Dec", type: "Event" },
    { id: 3, title: "New AI Research Lab", date: "22 Dec", type: "Lab" },
    { id: 4, title: "Placement: Google", date: "18 Dec", type: "Jobs" },
    { id: 5, title: "Winter Tech Fest", date: "15 Dec", type: "Fest" },
  ];

  return (
    <div className="min-h-screen font-sans text-[#1E293B] bg-white overflow-x-hidden">
      <Navbar />
      <HomepageHeaderCollegeInfo />

      <style>
        {`
          .modern-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .modern-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
            margin-inline: 20px;
          }
          .modern-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            border-radius: 10px;
            border: 2px solid #f1f5f9;
          }
          .modern-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to right, #2563eb, #7c3aed);
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* SECTION 1: WELCOME & PRO-COMMAND CENTER */}
      <section className="pt-10 pb-20 px-6 bg-[#F1F7FE] relative overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(1deg); }
    }
    .animate-float-slow { animation: float 8s ease-in-out infinite; }
    .stagger-1 { animation: fadeIn 0.5s ease-out forwards; animation-delay: 0.1s; opacity: 0; }
    .stagger-2 { animation: fadeIn 0.5s ease-out forwards; animation-delay: 0.2s; opacity: 0; }
    .stagger-3 { animation: fadeIn 0.5s ease-out forwards; animation-delay: 0.3s; opacity: 0; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
          }}
        />

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 blur-[100px] rounded-full animate-float-slow"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/70">
                  Intelligence Dashboard
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                Welcome back, <br />
                <span className="text-blue-600 italic">Champ Alex!</span>
              </h1>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-4 pr-8 rounded-2xl border border-white shadow-xl shadow-blue-900/5 flex items-center gap-4 hover:bg-white transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Globe size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Campus Connectivity
                </p>
                <p className="text-sm font-bold text-slate-800">Operational</p>
              </div>
            </div>
          </div>

          {/* PRIMARY TILES: FIXED OVERFLOW & ALIGNMENT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-stretch">
            {[
              {
                icon: Coffee,
                title: "Digital Canteen",
                color: "orange-500",
                desc: "Order meals and track real-time queue status easily.",
                style: "stagger-1",
              },
              {
                icon: BookOpen,
                title: "Digital Library",
                color: "blue-600",
                desc: "Book study cabins and access digital library resources.",
                style: "stagger-2",
              },
              {
                icon: User,
                title: "My Profile",
                color: "slate-900",
                desc: "Manage your academic ID and track your credit progress.",
                style: "stagger-3",
              },
            ].map((tile, idx) => (
              <div
                key={idx}
                className={`group relative bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col ${tile.style}`}
              >
                {/* THE TOP HOVER LINE - FIXED OVERFLOW */}
                <div
                  className={`absolute top-0 left-0 w-full h-2 transition-transform duration-500 scale-x-0 group-hover:scale-x-100`}
                  style={{
                    backgroundColor:
                      tile.icon === Coffee
                        ? "#f97316"
                        : tile.icon === BookOpen
                        ? "#2563eb"
                        : "#0f172a",
                  }}
                ></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}
                    style={{
                      backgroundColor:
                        tile.icon === Coffee
                          ? "#f97316"
                          : tile.icon === BookOpen
                          ? "#2563eb"
                          : "#0f172a",
                    }}
                  >
                    <tile.icon size={30} />
                  </div>

                  <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3">
                    {tile.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed font-medium flex-grow">
                    {tile.desc}
                  </p>

                  <div
                    className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      color:
                        tile.icon === Coffee
                          ? "#f97316"
                          : tile.icon === BookOpen
                          ? "#2563eb"
                          : "#0f172a",
                    }}
                  >
                    Open Module <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SECONDARY ROW: WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ORDER HISTORY */}
            <div className="group bg-white p-3 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex items-center border border-white hover:border-purple-200 transition-all duration-500 cursor-pointer">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-purple-100 group-hover:rotate-6 transition-transform">
                <ShoppingBag size={28} />
              </div>
              <div className="px-8 flex-1">
                <h4 className="font-black text-slate-800 text-lg uppercase italic tracking-tighter">
                  Order History
                </h4>
                <p className="text-slate-400 text-[10px] font-bold tracking-widest mt-1">
                  LATEST UPDATED: 2 MINS AGO
                </p>
              </div>
              <div className="pr-8 text-purple-300 group-hover:text-purple-600 transition-colors">
                <ChevronRight size={28} />
              </div>
            </div>

            {/* SOS HUB */}
            <div className="group bg-rose-600 p-3 rounded-[2.5rem] shadow-2xl shadow-rose-900/20 flex items-center border border-rose-500 hover:bg-rose-700 transition-all duration-500 cursor-pointer">
              <div className="w-20 h-20 bg-white rounded-3xl flex flex-col items-center justify-center text-rose-600 shrink-0 shadow-sm group-hover:scale-90 transition-transform">
                <AlertTriangle size={28} className="animate-pulse" />
              </div>
              <div className="px-8 flex-1">
                <h4 className="font-black text-white text-lg uppercase italic tracking-tighter">
                  SOS Hub
                </h4>
                <p className="text-rose-100 text-[10px] font-bold tracking-widest mt-1 opacity-70">
                  EMERGENCY ASSISTANCE
                </p>
              </div>
              <div className="pr-8 text-white flex items-center gap-3">
                <Camera
                  size={24}
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                />
                <ChevronRight size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* SECTION 2: SMART CAMPUS GALLERY - HIGH-ENGAGEMENT MOSAIC */}
      <section className="py-20 px-6 bg-[#F8FAFC] relative overflow-hidden">
        {/* Abstract Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-200 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md">
                  Live
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  Campus Atmosphere
                </span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900">
                Visual{" "}
                <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-4">
                  Visions.
                </span>
              </h2>
            </div>
            <p className="text-slate-500 text-sm font-medium max-w-xs md:text-right border-l-2 md:border-l-0 md:border-r-2 border-blue-600 px-4">
              A curated glimpse into the architecture and energy of our smart
              ecosystem.
            </p>
          </div>

          {/* THE MOSAIC GRID - Height reduced to 550px for decent showing */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[550px]">
            {/* 1. Large Feature Card */}
            <div className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] shadow-xl bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1766430677995-a60227a65a3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMXx8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Main Campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute bottom-8 left-8 right-8 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  Architecture
                </p>
                <h4 className="text-white text-2xl font-black italic uppercase tracking-tighter">
                  The Innovation Hub
                </h4>
              </div>
            </div>

            {/* 2. Top Wide Card */}
            <div className="md:col-span-5 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] shadow-lg bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1761839257287-3030c9300ece?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Digital Plaza"
              />
              <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* 3. Top Small Card */}
            <div className="md:col-span-3 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] shadow-lg bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1761839258239-2be2146f1605?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MHx8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-full object-cover transition-all duration-700 group-hover:rotate-2 group-hover:scale-110"
                alt="Study Zone"
              />
            </div>

            {/* 4. Bottom Row - Left (Small Square) */}
            <div className="md:col-span-3 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] shadow-lg bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1761839262867-af53d08b0eb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1N3x8fGVufDB8fHx8fA%3D%3D"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Tech Library"
              />
            </div>

            {/* 5. Bottom Row - Right (Wide Info Card) */}
            <div className="md:col-span-5 md:row-span-1 bg-blue-600 rounded-[2.5rem] p-8 flex items-center justify-between text-white group cursor-pointer hover:bg-blue-700 transition-all">
              <div className="space-y-2">
                <p className="text-4xl font-black italic tracking-tighter">
                  150+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                  Interactive Spaces
                </p>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-all">
                <ArrowRight size={32} />
              </div>
            </div>
          </div>

          {/* Interactive Pagination Look */}
          <div className="mt-10 flex items-center gap-3 justify-center">
            <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
            <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
            <div className="w-2 h-1 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* SECTION 3: LIVE FEED (CYBER-WHITE DESIGN) */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        {/* Subtle grid pattern background for a "technical" feel */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
                <span className="text-blue-600 font-black uppercase text-[10px] tracking-[0.4em]">
                  Broadcast Stream
                </span>
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">
                Live <span className="text-blue-600">Feed.</span>
              </h2>
            </div>

            {/* Sleek Progress Indicator */}
            <div className="hidden md:flex items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Scroll Sync
                </p>
                <p className="text-lg font-black text-blue-600 italic leading-none">
                  {Math.round(scrollProgress)}%
                </p>
              </div>
              <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-8 pb-12 modern-scroll snap-x snap-mandatory px-4"
          >
            {notices.map((note) => (
              <div
                key={note.id}
                className="min-w-[340px] md:min-w-[440px] snap-center"
              >
                <div className="group relative bg-white p-10 rounded-[3rem] border-2 border-slate-100 hover:border-blue-600 transition-all duration-500 shadow-xl shadow-slate-200/50 hover:shadow-blue-500/10 h-full flex flex-col">
                  {/* Indexing Badge */}
                  <div className="absolute top-8 right-10">
                    <span className="text-4xl font-black text-slate-50 italic group-hover:text-blue-50 transition-colors">
                      #{note.id}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block">
                        {note.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {note.date}
                      </span>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-slate-900 leading-[1.2] mb-4 group-hover:text-blue-600 transition-colors italic uppercase tracking-tight">
                      {note.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      System synchronization and digital resource updates are
                      now being deployed across the campus cloud.
                    </p>
                  </div>

                  {/* Action Area */}
                  <div className="mt-12 flex items-center justify-between">
                    <button className="flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] group/btn">
                      <span className="bg-slate-900 text-white p-2 rounded-xl group-hover/btn:bg-blue-600 group-hover/btn:scale-110 transition-all">
                        <ArrowRight size={14} />
                      </span>
                      Full Protocol
                    </button>

                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-600 rounded-full group-hover:w-4 transition-all"></div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Subtle Gradient Shadow Reveal */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[3rem]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/*Collaborate */}

      <Collaboration />

      {/* SECTION 4: SMART CAMPUS CORE */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content Area */}
          <div className="space-y-8">
            <div>
              <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                Smart <br />
                <span className="text-yellow-300 underline decoration-4 underline-offset-8">
                  Campus.
                </span>
              </h2>
              <p className="text-blue-100/80 text-lg leading-relaxed mt-8 max-w-lg font-medium">
                Revolutionizing the student experience through seamless
                integration. We bridge the gap between physical infrastructure
                and digital efficiency.
              </p>
            </div>

            {/* Stats Widgets */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                <p className="text-4xl font-black mb-1 text-yellow-300 group-hover:scale-110 transition-transform origin-left">
                  50+
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                  Global Partners
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                <p className="text-4xl font-black mb-1 text-yellow-300 group-hover:scale-110 transition-transform origin-left">
                  24/7
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                  Cloud Uptime
                </p>
              </div>
            </div>
          </div>

          {/* THE 4 OPTIONS: CLIP GRID STYLE */}
          <div className="grid grid-cols-2 gap-6 relative">
            {[
              {
                icon: Trophy,
                label: "Hackathons",
                color: "text-orange-400",
                shadow: "shadow-orange-500/20",
                delay: "",
              },
              {
                icon: Gamepad2,
                label: "Events",
                color: "text-pink-400",
                shadow: "shadow-pink-500/20",
                delay: "md:translate-y-12",
              },
              {
                icon: Shield,
                label: "Security",
                color: "text-blue-400",
                shadow: "shadow-blue-500/20",
                delay: "",
              },
              {
                icon: Cpu,
                label: "Digitalized",
                color: "text-purple-400",
                shadow: "shadow-purple-500/20",
                delay: "md:translate-y-12",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-[3rem] p-10 flex flex-col items-center justify-center text-center transition-all duration-700 hover:-translate-y-4 hover:rotate-2 shadow-2xl ${item.shadow} ${item.delay}`}
              >
                {/* Inner Decorative Ring */}
                <div className="absolute inset-4 border border-slate-50 rounded-[2.2rem] pointer-events-none group-hover:scale-105 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div
                    className={`mb-6 transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 ${item.color}`}
                  >
                    <item.icon size={48} strokeWidth={1.5} />
                  </div>
                  <h5 className="font-black text-slate-900 uppercase text-sm tracking-widest italic">
                    {item.label}
                  </h5>
                  {/* Small decorative clip-line */}
                  <div className="mt-4 h-1 w-8 bg-slate-100 mx-auto rounded-full group-hover:w-16 group-hover:bg-blue-600 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
