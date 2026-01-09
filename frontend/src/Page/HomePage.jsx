import React, { useState } from "react";
import {
  AlertCircle,
  Camera,
  MapPin,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Bell,
  ArrowRight,
  Menu,
  X,
  LayoutGrid,
  Building2,
  Cpu,
  BellRing,
  BarChart2,
  Leaf,
} from "lucide-react";

import {
  Linkedin,
  Twitter,
  Instagram,
  Github,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar/Navbar";
import deep from "../assets/Deep.jpg";
import trideep from "../assets/Trideep.jpg";
import sangita from "../assets/Sangita.png";
import { useAuth } from "../context/AuthContext";

export default function CampusReporterHome() {
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const statusStyles = {
    green: {
      dot: "bg-green-500",
      badge: "bg-green-100 text-green-700",
    },
    yellow: {
      dot: "bg-yellow-500",
      badge: "bg-yellow-100 text-yellow-700",
    },
    blue: {
      dot: "bg-blue-500",
      badge: "bg-blue-100 text-blue-700",
    },
  };


  const stats = [
    { value: "1 Platform", label: "Unified Campus System" },
    { value: "0 Queues ", label: "Fully Digital Services" },
    { value: "100% Online ", label: "Paperless Operations" },
    { value: "∞ Scale", label: "Built for Any Institution" },
  ];

  const features = [
    {
      icon: <LayoutGrid className="sm:w-8 sm:h-8" />,
      title: "Unified Campus Platform",
      description:
        "All student and administrative services integrated into one seamless system",
    },
    {
      icon: <Building2 className="sm:w-8 sm:h-8" />,
      title: "Canteen & Library Management",
      description:
        "Order food, manage books, issue/return, payments, and tracking — fully digital",
    },
    {
      icon: <Cpu className="sm:w-8 sm:h-8" />,
      title: "Smart Automation",
      description:
        "Automated workflows, role-based access, and intelligent data handling",
    },
    {
      icon: <BellRing className="sm:w-8 sm:h-8" />,
      title: "Real-Time Communication",
      description:
        "Instant notifications, updates, and alerts for students and staf",
    },
  ];

  const issueTypes = [
    { name: "Electrical", color: "bg-yellow-500", icon: "⚡" },
    { name: "Water/Plumbing", color: "bg-blue-500", icon: "💧" },
    { name: "Sanitation", color: "bg-green-500", icon: "🧹" },
    { name: "Infrastructure", color: "bg-red-500", icon: "🏗️" },
    { name: "Safety", color: "bg-purple-500", icon: "🛡️" },
    { name: "Other", color: "bg-gray-500", icon: "📋" },
  ];

  const founders = [
    {
      name: "Deep Das",
      role: "Founder",
      bio: "Full Stack Web Developer and AI Engineer building modern, scalable web applications with Generative AI, intelligent automation, and clean, high-performance UI/UX.",
      image: deep,
      social: {
        li: "https://www.linkedin.com/in/deep-das-developer",
        gh: "https://github.com/deepdas00",
        tw: "https://twitter.com/DeepDas890",
        pf: "https://deep-das-dev.netlify.app/",
      },
      side: "left",
    },
    {
      name: "Sangita Ghosh",
      role: "FOUNDER",
      bio: "Frontend Developer specializing in building scalable, high-performance, and modern user interfaces, delivering seamless, responsive, and visually engaging digital experiences.",
      image: sangita,
      social: {
        li: "https://www.linkedin.com/in/sangita-ghosh-dev",
        gh: "https://github.com/sangita-ghosh",
      },
      featured: true,
    },
    {
      name: "Trideep Ray",
      role: "Founder",
      bio: "Backend Developer building scalable, multi-tenant, and hybrid systems, specializing in secure APIs, efficient server architectures, and high-performance cloud-integrated solutions.",
      image: trideep,
      social: {
        li: "https://www.linkedin.com/in/trideep-ray-670b36356",
        gh: "https://github.com/trideep00005",
      },
      side: "right",
    },
  ];

  return (
    <div
      id="home"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section
        className={`${
          user ? "pt-20 md:pt-24 pb-5" : "pt-24 md:pt-28"
        } px-4 sm:px-6 lg:px-8 pb-5`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Stacked on mobile, 2 columns on medium screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="text-center md:text-left">
              {/* <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
                <Zap className="w-4 h-4" />
                <span>Powered by Google AI </span>
              </div> */}

              <h1 className="text-[25px] pb-3 sm:text-5xl md:text-4xl font-bold text-gray-900 sm:mb-6 mb-2 leading-tight">
                Build a Queue-less, Paperless <br />
                <span className="text-blue-600 md:text-6xl sm:text-5xl text-[35px]">
                  Smart Campus
                </span>
              </h1>
              <p className="text-[11px] sm:text-lg md:text-xl text-gray-600 mb-5 max-w-xl mx-auto md:mx-0 text-center md:text-left leading-relaxed">
                Smart Campus is a complete digital platform that connects
                students, faculty, and administrators to manage campus
                operations seamlessly — from issue reporting and communication
                to services like canteen, library, and notifications — all in
                one intelligent system.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mt-6 sm:mt-8 px-4 sm:px-0">
                <button className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all duration-200 flex items-center justify-center space-x-3 active:scale-95 shadow-md">
                  <Camera className="sm:w-5 w-4 sm:h-5 h-4" />
                  <span className="text-[14px] sm:text-lg">
                    Report an Issue
                  </span>
                </button>

                <button className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 border border-gray-200 flex items-center justify-center space-x-3 active:scale-95">
                  <BarChart3 className="sm:w-5 w-4 sm:h-5 h-4" />
                  <span className="text-[14px] sm:text-lg">View Dashboard</span>
                </button>
              </div>

              {/* Stats - Grid 3 cols on mobile */}
              <div className="sm:mt-12 pt-8 border-t border-gray-100 md:border-0 md:pt-0">
                {/* - Used a flexible grid that handles small screens better
                   - Added a slight background tint/shape for mobile to make it feel like a "Results" section
                */}
                <div className="grid grid-cols-3 gap-2 sm:gap-8 items-start justify-center">
                  {stats.slice(0, 3).map((stat, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center md:items-start group"
                    >
                      {/* The Value: Scaled for mobile readability */}
                      <div className="sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight transition-transform group-hover:scale-105">
                        {stat.value}
                      </div>
                      <div className="text-[6px] sm:text-[12px] lg:text-[10px] md:text-sm text-blue-600 font-bold uppercase tracking-widest mt-1 text-center md:text-left leading-tight">
                        {stat.label}
                      </div>

                      {/* Optional: Subtle divider line between items on mobile only */}
                      {idx < 2 && (
                        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gray-200 sm:hidden" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Visuals */}
            <div className="relative sm:mt-8 md:mt-0 w-full max-w-full overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-3 sm:p-8 shadow-2xl">
                {/* Recent Reports Card */}
                <div className="bg-white rounded-2xl p-3 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Recent Reports
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full animate-pulse">
                      Live
                    </span>
                  </div>

                  {[
                    {
                      issue: "Broken light in Library",
                      status: "Resolved",
                      time: "2m ago",
                      color: "green",
                    },
                    {
                      issue: "Water leakage in Hostel B",
                      status: "In Progress",
                      time: "15m ago",
                      color: "yellow",
                    },
                    {
                      issue: "Damaged road near Gate 2",
                      status: "Reported",
                      time: "1h ago",
                      color: "blue",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          statusStyles[item.color].dot
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {item.issue}
                        </div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>

                      <span
                        className={`text-[10px] sm:text-xs px-2 py-1 rounded whitespace-nowrap ${
                          statusStyles[item.color].badge
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Issue Types */}
                <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                  {issueTypes.slice(0, 3).map((type, idx) => (
                    <div
                      key={idx}
                      className={`${type.color} rounded-xl p-3 sm:p-4 text-white text-center hover:scale-105 transition cursor-pointer`}
                    >
                      <div className="text-lg sm:text-2xl mb-1">
                        {type.icon}
                      </div>
                      <div className="text-[8px] sm:text-xs font-medium uppercase">
                        {type.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative blobs — hidden on mobile to avoid overflow */}
              <div className="hidden sm:block absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
              <div className="hidden sm:block absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="sm:py-16 py-10 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-[15px] sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Built to digitize every aspect of campus life on a single
              intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="sm:p-6 p-4 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-blue-300 hover:bg-white hover:shadow-xl flex flex-col items-start sm:items-center transition cursor-pointer"
                onMouseEnter={() => setActiveFeature(idx)}
                onClick={() => setActiveFeature(idx)}
              >
                <div
                  className={`flex items-center mb-4 space-x-3 flex-row sm:flex-col`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 ${
                      activeFeature === idx
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    } transition-colors`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed items-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-8 sm:py-16 md:py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="sm:max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-5xl  text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Simple. Smart. Scalable.</p>
          </div>


{/* 
Subtitle (replace current one)

Simple. Smart. Scalable.

Step 1 — Access & Submit

Students and staff access campus services, submit issues, place orders, and request services digitally

Step 2 — Process & Manage

The system automatically routes requests, manages workflows, and updates records in real time

Step 3 — Track & Complete

Users track progress, receive notifications, and complete tasks with full transparency */}


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Access & Submit",
                desc: "Students and staff access campus services, submit issues, place orders, and request services digitally",
                icon: <Camera />,
              },
              {
                step: "2",
                title: "Process & Manage",
                desc: "The system automatically routes requests, manages workflows, and updates records in real time",
                icon: <Zap />,
              },
              {
                step: "3",
                title: "Track & Complete",
                desc: "Users track progress, receive notifications, and complete tasks with full transparency",
                icon: <CheckCircle />,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-md group-hover:shadow-xl transition-all text-center">
                  <div className="w-14 h-14 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto item">
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-4 text-blue-600">
                    {React.cloneElement(item.icon, { className: "w-10 h-10" })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-600">{item.desc}</p>
                </div>
                {/* Hide arrows on mobile */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-10 transform -translate-y-1/2 z-6">
                    <ArrowRight className="w-12 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                Real-World Impact
              </h2>

              <div className="space-y-8 mt-10">
                {[
                  {
                    icon: <Zap />,
                    title: "Faster Operations",
                    desc: "Digital workflows eliminate queues and reduce waiting time across campus services",
                  },
                  {
                    icon: <ShieldCheck />,
                    title: "Improved Transparency",
                    desc: "Students and administrators track requests and activities in real time",
                  },
                  {
                    icon: <BarChart3 />,
                    title: "Data-Driven Decisions",
                    desc: "Centralized data helps institutions identify bottlenecks and improve performance",
                  },
                  {
                    icon: <Leaf />,
                    title: "Sustainable Campus",
                    desc: "Paperless processes reduce waste and promote eco-friendly operations",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {React.cloneElement(item.icon, { className: "w-6 h-6" })}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest opacity-80">
                Platform Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/10"
                  >
                    <div className="text-lg sm:text-2xl md:text-4xl font-bold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[8px] sm:text-[12px] md:text-xs text-blue-100 uppercase font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*FOUNDER SECTION */}

      <section
        id="Founder-section"
        className="min-h-screen w-full bg-white overflow-hidden flex flex-col"
      >
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col">
          {/* Header */}
          <div className="text-center ">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
              <ShieldCheck size={12} className="text-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                The Architectures
              </span>
            </div>
            <h2 className="text-3xl mb-2 sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
              THE FOUNDING <span className="text-blue-600">TRIAD.</span>
            </h2>
          </div>

          {/* Full Image Grid - No Scroll */}
          <div className="flex-1 flex flex-col lg:flex-row items-baseline justify-center gap-6 lg:gap-2 pb-20 mt-1">
            {founders.map((founder, index) => {
              const isMiddle = index === 1;

              return (
                <div
                  key={index}
                  className={`relative group transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${
                    isMiddle
                      ? " lg:scale-100 w-full lg:w-[350px] h-[500px]"
                      : " lg:scale-100 w-full lg:w-[350px] h-[500px] lg:mt-10"
                  }
        `}
                >
                  {/* Main Card Container */}
                  <div className="relative w-full h-full rounded-[3.5rem] overflow-hidden bg-slate-900 shadow-2xl transition-transform duration-700 group-hover:translate-y-[-10px]">
                    {/* IMAGE: Full cover with zoom effect */}
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 
              ${
                isMiddle
                  ? "scale-105 group-hover:scale-112"
                  : "scale-110 group-hover:scale-120"
              }
              ${!isMiddle && "opacity-80 group-hover:opacity-100"}
            `}
                    />

                    {/* OVERLAYS */}
                    {/* 1. Base Gradient Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t bg-gradient-to-t 
             from-black/90
             via-transparent 
             to-transparent  opacity-100 group-hover:opacity-40 transition-opacity duration-700"
                    />

                    {/* 2. Color Tint (Middle is Blue, Sides are Slate) */}
                    <div
                      className={`absolute inset-0 mix-blend-overlay transition-opacity duration-700 
            ${
              isMiddle
                ? "bg-blue-500/20 group-hover:opacity-0"
                : "bg-slate-500/30 group-hover:opacity-0"
            }`}
                    />

                    {/* 3. Glossy Shine streak */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="absolute inset-x-0 bottom-0 p-8 z-20">
                      {/* Name and Role */}
                      <div className="mb-4 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 leading-none">
                          {founder.role}
                        </p>
                        <h3
                          className={`font-black text-white uppercase tracking-tighter leading-none transition-all duration-500 flex gap-2
                ${isMiddle ? "text-3xl" : "text-2xl"}
              `}
                        >
                          {founder.name.split(" ")[0]} <br />
                          <span className="text-white/50 group-hover:text-white transition-colors">
                            {founder.name.split(" ")[1]}
                          </span>
                        </h3>
                      </div>

                      {/* Hidden Bio - Expands upward */}
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-700 ease-in-out">
                        <div className="overflow-hidden">
                          <p className="text-white/70 text-sm font-medium leading-relaxed mb-6 pr-4">
                            {founder.bio}
                          </p>

                          {/* Social Dock */}
                          <div className="flex gap-2 p-2 w-fit bg-black/1 backdrop-blur-sm border border-black/4 rounded-2xl">
                            {Object.entries(founder.social).map(
                              ([key, url]) => (
                                <a
                                  key={key}
                                  href={url}
                                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-blue-600 text-white transition-all duration-300"
                                >
                                  {key === "li" && <Linkedin size={18} />}
                                  {key === "tw" && <Twitter size={18} />}
                                  {key === "ig" && <Instagram size={18} />}
                                  {key === "gh" && <Github size={18} />}
                                  {key === "pf" && <ArrowUpRight size={18} />}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating ID Badge */}
                  </div>

                  {/* Outer Glow for the Middle Founder */}
                  {isMiddle && (
                    <div className="absolute -inset-4 bg-blue-500/10 blur-[100px] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Your Campus Better?
          </h2>
          <p className="text-xs sm:text-lg mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of students already using Smart Campus to create a
            safer, cleaner environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 sm:px-10 sm:py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
              Get Started Now
            </button>
            <button className="px-8 py-3 sm:px-10 sm:py-4 bg-transparent border-2 border-white/50 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
