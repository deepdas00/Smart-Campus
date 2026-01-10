import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  ImageIcon,
  X,
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

import { useAuth } from "../context/AuthContext";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar/Navbar";
// import CollegeInfo from "../Components/CollegeInfo";
import HomepageHeaderCollegeInfo from "../Components/HomepageHeaderCollegeInfo";
import Collaboration from "./Collaboration";
import { Link, Links } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomeLogin() {
  const scrollRef = useRef(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(0);
  const [shortName, setShortName] = useState("Alex Saff");
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const previewGallery = gallery.slice(0, 5);
  const fullGallery = gallery;

  useEffect(() => {
    if (user?.studentName) {
      const words = user.studentName.trim().split(" "); // split by space
      if (words.length === 1) {
        setShortName(words[0]); // only one word
      } else {
        setShortName(words[0][0] + words[1][0]); // first letters of first + second word
      }
    }
  }, [user]);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/college/gallery`, {
        withCredentials: true,
      });

      // Expecting array from backend
      setGallery(res.data.data || []);
    } catch (err) {
      console.error("Fetch gallery failed", err);
      toast.error("Failed to load campus gallery");
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchGallery();
  }, [user]);

  const [notices, setNotices] = useState([]);
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/college/notifications`, {
        withCredentials: true,
      });

      // Expecting array from backend
      setNotices(res.data.data || []);
    } catch (err) {
      console.error("Fetch gallery failed", err);
      toast.error("Failed to load campus gallery");
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

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
      <section className="pt-10 pb-20 px-3 sm:px-6 bg-[#F1F7FE] relative overflow-hidden">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between sm:mb-16 mb-8 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="sm:text-[10px] text-[8px] font-black uppercase tracking-[0.2em] text-blue-600/70">
                  Intelligence Dashboard
                </span>
              </div>
              <h1 className="text-2xl sm:text-5xl font-black tracking-tighter text-slate-900">
                Welcome back, <br />
                <span className="text-blue-600 italic">
                  Champ {user?.fullName || "Alex"}!
                </span>
              </h1>
            </div>

            <div className="bg-white/70 backdrop-blur-md p-4 pr-8 rounded-2xl border border-white shadow-xl shadow-blue-900/5 flex items-center gap-4 hover:bg-white transition-colors scale-90 sm:scale-100 hidden sm:flex">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 sm:mb-12 mb-8 items-stretch">
            {[
              {
                link: "/canteen",
                icon: Coffee,
                title: "Digital Canteen",
                color: "orange-500",
                desc: "Order meals and track real-time queue status easily.",
                style: "stagger-1",
              },
              {
                link: "/library",
                icon: BookOpen,
                title: "Digital Library",
                color: "blue-600",
                desc: "Book study cabins and access digital library resources.",
                style: "stagger-2",
              },
              {
                link: "/profile",
                icon: User,
                title: "My Profile",
                color: "slate-900",
                desc: "Manage your academic ID and track your credit progress.",
                style: "stagger-3",
              },
            ].map((tile, idx) => (
              <Link to={tile.link} key={idx}>
                <div
                  key={idx}
                  className={`group relative bg-white sm:p-10 p-4 sm:rounded-[3rem] shadow-sm border rounded-[1rem] border-slate-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col ${tile.style}`}
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
                    <div className="flex sm:flex-col gap-2">
                      <div
                      className={`sm:w-16 w-8 h-8 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-8 text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}
                      style={{
                        backgroundColor:
                          tile.icon === Coffee
                            ? "#f97316"
                            : tile.icon === BookOpen
                            ? "#2563eb"
                            : "#0f172a",
                      }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <tile.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3">
                      {tile.title}
                    </h3>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed font-medium flex-grow px-4 sm:px-0">
                      {tile.desc}
                    </p>

                    <div
                      className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest sm:opacity-0 group-hover:opacity-100 px-4 sm:px-0 transition-opacity"
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
              </Link>
            ))}
          </div>

          {/* SECONDARY ROW: WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-8 gap-4">
            {/* ORDER HISTORY */}
            <Link to="/orders">
              <div className="group bg-white p-3 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex items-center border border-white hover:border-purple-200 transition-all duration-500 cursor-pointer">
                <div className="sm:w-20 w-8 h-8 sm:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-purple-100 group-hover:rotate-6 transition-transform">
         


                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                </div>
                <div className="sm:px-8 px-2 flex-1">
                  <h4 className="font-black text-slate-800 text-lg uppercase italic tracking-tighter">
                    Order History
                  </h4>
                  <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold tracking-widest mt-1">
                    LATEST UPDATED: 2 MINS AGO
                  </p>
                </div>
                <div className="pr-8 text-purple-300 group-hover:text-purple-600 transition-colors">
                  <ChevronRight size={28} />
                </div>
              </div>
            </Link>

            {/* SOS HUB */}
            <Link to="/report">
              <div className="group bg-rose-600 p-3 rounded-[2.5rem] shadow-2xl shadow-rose-900/20 flex items-center border border-rose-500 hover:bg-rose-700 transition-all duration-500 cursor-pointer ">
                <div className="sm:w-20 w-8 h-8 sm:h-20 bg-white rounded-3xl flex flex-col items-center justify-center text-rose-600 shrink-0 shadow-sm group-hover:scale-90 transition-transform">
               

                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                </div>
                <div className="px-2 sm:px-8 flex-1">
                  <h4 className="font-black text-white text-lg uppercase italic tracking-tighter">
                    SOS Hub
                  </h4>
                  <p className="text-rose-100 text-[8px] sm:text-[10px] font-bold tracking-widest mt-1 opacity-70">
                    EMERGENCY ASSISTANCE
                  </p>
                </div>
                <div className="pr-8 text-white flex items-center gap-3">
                  


                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <Camera className="w-6 h-6 sm:w-7 sm:h-7 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                  <ChevronRight size={28} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* SECTION 2: SMART CAMPUS GALLERY - HIGH-ENGAGEMENT MOSAIC */}
      <section className="pt-0 pb-4 sm:py-20 px-3 sm:px-6 bg-[#F8FAFC] relative overflow-hidden">
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
              <h2 className="text-2xl sm:text-5xl font-black uppercase italic tracking-tighter text-slate-900">
                Visual{" "}
                <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-4">
                  Visions.
                </span>
              </h2>
            </div>
            <p className="text-slate-500 text-[10px] sm:text-sm font-medium max-w-xs md:text-right border-l-2 md:border-l-0 md:border-r-2 border-blue-600 px-4">
              A curated glimpse into the architecture and energy of our smart
              ecosystem.
            </p>
          </div>

          {/* THE MOSAIC GRID - Height reduced to 550px for decent showing */}
          {/* PREVIEW GALLERY (ONLY 4–5 IMAGES) */}
          <div className="grid grid-cols-12 gap-1 sm:gap-4 h-auto md:h-[550px]">

            {loadingGallery ? (
              <p className="text-center text-slate-400">Loading gallery...</p>
            ) : (
              previewGallery.map((img, index) => (
                <div
                  key={img._id}
                  className={`relative group overflow-hidden  sm:rounded-[2.5rem] rounded-[0.5rem] shadow-lg bg-slate-200 min-h-[140px] sm:min-h-0
        ${
          index === 0
            ? "col-span-4 row-span-5"
            : index === 1
            ? "col-span-5 row-span-3"
            : index === 2
            ? "col-span-3 row-span-3"
            : index === 3
            ? "col-span-3 row-span-2"
            : "col-span-5 row-span-2 bg-blue-600 cursor-pointer"
        }
      `}
                  onClick={index === 4 ? () => setShowPopup(true) : undefined}
                >
                  {index === 4 ? (
                    /* 150+ CARD */
                    <div
                      className="h-full flex items-center justify-between py-11 px-2 sm:p-8 text-white bg-black/50"
                      style={{ backgroundImage: `url(${img.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

                      <div className="z-5">
                        <p className="text-[12px] sm:text-5xl font-black italic">More </p>
                        <p className="text-[7px] sm:text-[11px] uppercase tracking-widest opacity-80">
                          Interactive Spaces
                        </p>
                      </div>
                   


                      <div className="w-7 h-7 sm:w-12 sm:h-12 flex items-center justify-center z-5">
                        <ArrowRight className="w-4 h-4 sm:w-7 sm:h-7" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={img.image}
                        alt={img.description}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />

                      {/* DESCRIPTION OVERLAY */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end"
                      >
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
                          Campus Life
                        </p>
                        <h4 className="text-white text-xl font-black italic uppercase">
                          {img.description}
                        </h4>

                        <h4 className="text-gray-400 flex w-full text-[11px] font-black items-end justify-end">
                          {new Date(img.createdAt).toLocaleDateString()}
                        </h4>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* SECTION 3: LIVE FEED (CYBER-WHITE DESIGN) */}
      <section className="py-10 sm:py-24 px-3 sm:px-6 bg-white relative overflow-hidden">
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-16 gap-6">
            <div className="space-y-2 sm:scale">
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
              <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-slate-900">
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
            className="flex overflow-x-auto gap-5 sm:gap-8 pb-8 sm:pb-12 modern-scroll snap-x snap-mandatory px-4"
          >
            {notices.map((note) => (
              <div
                key={note._id}
                className="min-w-[75vw] sm:min-w-[340px] md:min-w-[440px] snap-center"
              >
                <div className="group relative bg-white px-4 py-4 sm:p-10 sm:rounded-[3rem] rounded-[1rem] border-2 border-slate-100 hover:border-blue-600 transition-all duration-500 shadow-xl shadow-slate-200/50 hover:shadow-blue-500/10 h-full flex flex-col">
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
                        {note.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(note.updatedAt)
                          .toLocaleDateString("en-GB")
                          .replaceAll("/", "-")}
                      </span>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <div className="flex-1">
                    <h4 className="text-md sm:text-2xl font-black text-slate-900 leading-[1.2] mb-4 group-hover:text-blue-600 transition-colors italic uppercase tracking-tight">
                      {note.title}
                    </h4>
                    <p className="text-slate-500 sm:text-sm text-xs leading-relaxed font-medium">
                      {note.description}
                    </p>
                  </div>

                  {/* Action Area */}
                  <div className="mt-12 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedNote(note);
                        setOpen(true);
                      }}
                      className="flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] group/btn"
                    >
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

      {open && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop with Blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white overflow-hidden rounded-[2rem] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Image Header (If pic exists) */}
            {selectedNote.pic && (
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={selectedNote.pic}
                  alt={selectedNote.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="py-8 px-4 sm:p-8">
              {/* Category Badge & Date */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                  {selectedNote.category}
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  {new Date(selectedNote.updatedAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>

              {/* Content */}
              <h2 className="text-md sm:text-2xl font-black text-slate-800 leading-tight">
                {selectedNote.title}
              </h2>

              <p className="sm:text-md text-xs mt-4 text-slate-600 leading-relaxed">
                {selectedNote.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 px-6 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  Got it
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="py-3 px-6 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Close "X" Button (Top Right) */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <hr className="border-slate-100" />

      {/*Collaborate */}

      <Collaboration />

      {/* SECTION 4: SMART CAMPUS CORE */}
      <section className="py-10 sm:py-24 px-3 sm:px-6 bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white relative overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          {/* Text Content Area */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-6xl font-black italic uppercase tracking-tighter leading-none">
                Smart <br />
                <span className="text-yellow-300 underline decoration-4 underline-offset-8">
                  Campus.
                </span>
              </h2>
              <p className="text-blue-100/80 sm:text-lg text-xs leading-relaxed mt-8 max-w-lg font-medium">
                Revolutionizing the student experience through seamless
                integration. We bridge the gap between physical infrastructure
                and digital efficiency.
              </p>
            </div>

            {/* Stats Widgets */}
            <div className="grid grid-cols-2 sm:gap-6 gap-2">
              <div className="bg-white/5 backdrop-blur-2xl py-8 px-2 sm:p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group items-center justify-center flex flex-col">
                <p className="text-4xl font-black mb-1 text-yellow-300 group-hover:scale-110 transition-transform origin-left">
                  50+
                </p>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                  Global Partners
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                <p className="text-4xl font-black mb-1 text-yellow-300 group-hover:scale-110 transition-transform origin-left">
                  24/7
                </p>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                  Cloud Uptime
                </p>
              </div>
            </div>
          </div>

          {/* THE 4 OPTIONS: CLIP GRID STYLE */}
          <div className="grid grid-cols-2 gap-2 sm:gap-6 relative">
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
                className={`group relative bg-white sm:rounded-[3rem] rounded-[1rem] sm:p-10 py-5 justify-center items-center flex flex-col text-center transition-all duration-700 hover:-translate-y-4 hover:rotate-2 shadow-2xl ${item.shadow} ${item.delay}`}
              >
                {/* Inner Decorative Ring */}
                <div className="absolute inset-4 border border-slate-50 rounded-[2.2rem] pointer-events-none group-hover:scale-105 transition-transform duration-500"></div>

                <div className="relative z-10 flex items-center justify-center flex-col">
                  <div
                    className={`mb-6 transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 ${item.color}`}
                  >
                    <item.icon size={40} strokeWidth={1.5} />
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
      <>
        {showPopup ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10 animate-in fade-in duration-300">
            {/* BACKDROP */}
            <div
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-[1px]"
              onClick={() => setShowPopup(false)}
            ></div>

            {/* POPUP WRAPPER */}
            <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[1rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col animate-in zoom-in-95 duration-500">
              {/* HEADER */}
              <div className="p-4 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-30">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-2 rounded-xl text-white">
                    
<div className=" sm:w-12 sm:h-12 flex items-center justify-center ">
                        <ImageIcon className="w-5 h-5 sm:w-8 sm:h-8" />
                      </div>
                  </div>
                  <h3 className="text-md sm:text-3xl font-black italic uppercase tracking-tight text-slate-900">
                    Student <span className="text-blue-600">Gallery</span>
                  </h3>
                </div>

                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all border border-slate-100"
                >
                  <X size={30} />
                </button>
              </div>

              {/* GALLERY GRID */}
              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 sm:gap-x-10 sm:gap-y-10 gap-y-1">
                  {fullGallery?.length > 0 ? (
                    fullGallery.map((img) => (
                      <div
                        key={img._id}
                        className="relative aspect-[4/5] rounded-[1rem] sm:rounded-[2rem] overflow-hidden bg-slate-50 
                hover:scale-110 hover:z-20 transition-all duration-700 shadow-xl"
                      >
                        <img
                          src={img.image}
                          alt="Gallery"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                          <p className="text-blue-400 sm:text-[9px] text-[6px] uppercase tracking-widest">
                            Campus Life
                          </p>
                          <p className="text-white sm:font-bold text-[7px] sm:text-sm">
                            {img.description || ""}
                          </p>
                          <h4 className="text-gray-400 w-full text-[7px] sm:text-[11px] font-black text-right">
                            {img.createdAt
                              ? new Date(img.createdAt).toLocaleDateString()
                              : ""}
                          </h4>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 col-span-full">
                      No images found.
                    </p>
                  )}
                </div>

               
              </div>

              {/* FOOTER */}
              <div className="p-6 bg-white border-t border-slate-50 text-center">
                <p className="text-[6px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                  Scroll to Explore • Hover to Focus
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </>

      <Footer />
    </div>
  );
}
