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
} from "lucide-react";

import { Linkedin, Twitter, Instagram, Github, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar/Navbar";

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

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Instant Reporting",
      description:
        "Snap a photo and report issues in seconds with AI-powered descriptions",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Tracking",
      description:
        "Auto-detect and pin exact locations using Google Maps integration",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Classification",
      description:
        "Google Vision AI automatically categorizes and prioritizes issues",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Real-Time Updates",
      description:
        "Get notified instantly when your reported issues are resolved",
    },
  ];

  const stats = [
    { value: "500+", label: "Issues Resolved" },
    { value: "2.5 Days", label: "Avg Response Time" },
    { value: "95%", label: "Success Rate" },
    { value: "1000+", label: "Active Users" },
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
      role: "Chief Technology Officer",
      bio: "Architecting the core engine and infrastructure of our ecosystem.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      social: { li: "#", ig: "#", gh: "#", tw: "#" },
      side: "left"
    },
    {
      name: "Sangita Ghosh",
      role: "Chief Product Officer",
      bio: "Defining the human-centric product vision and high-fidelity user experiences.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      social: { li: "#", ig: "#", gh: "#", tw: "#" },
      featured: true
    },
    {
      name: "Trideep Ray",
      role: "Chief Operations Officer",
      bio: "Directing strategic institutional growth and operational excellence.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
      social: { li: "#", ig: "#", gh: "#", tw: "#" },
      side: "right"
    }
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
          user ? "pt-20 md:pt-24" : "pt-24 md:pt-28"
        } px-4 sm:px-6 lg:px-8 `}
      >
        <div className="max-w-7xl mx-auto">
          {/* Stacked on mobile, 2 columns on medium screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
                <Zap className="w-4 h-4" />
                <span>Powered by Google AI </span>
              </div>

              <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Report Campus Issues{" "}
                <span className="text-blue-600">Instantly</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-5 max-w-xl mx-auto md:mx-0 text-center md:text-left leading-relaxed">
                An AI-powered platform to report, track, and resolve campus
                infrastructure issues efficiently. Make your campus safer and
                better.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start mt-6 sm:mt-8 px-4 sm:px-0">
                <button className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all duration-200 flex items-center justify-center space-x-3 active:scale-95 shadow-md">
                  <Camera className="w-5 h-5" />
                  <span className="text-base sm:text-lg">Report an Issue</span>
                </button>

  
                <button className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 border border-gray-200 flex items-center justify-center space-x-3 active:scale-95">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-base sm:text-lg">View Dashboard</span>
                </button>
              </div>

              {/* Stats - Grid 3 cols on mobile */}
              <div className="mt-12 pt-8 border-t border-gray-100 md:border-0 md:pt-0">
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
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight transition-transform group-hover:scale-105">
          {stat.value}
        </div>

        {/* The Label: 
            - Extra small for a "pro" dashboard look
            - Added 'leading-tight' to prevent weird spacing if text wraps 
        */}
        <div className="text-[10px] sm:text-xs md:text-sm text-blue-600 font-bold uppercase tracking-widest mt-1 text-center md:text-left leading-tight">
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
           <div className="relative mt-8 md:mt-0 w-full max-w-full overflow-hidden">
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
            className={`w-2 h-2 rounded-full flex-shrink-0 ${statusStyles[item.color].dot}`}
          />

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {item.issue}
            </div>
            <div className="text-xs text-gray-500">
              {item.time}
            </div>
          </div>

          <span
            className={`text-[10px] sm:text-xs px-2 py-1 rounded whitespace-nowrap ${statusStyles[item.color].badge}`}
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
          <div className="text-[10px] sm:text-xs font-medium uppercase">
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
      <section id="features" className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge Google AI technologies to streamline issue
              reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50 border-2 border-transparent hover:border-blue-300 hover:bg-white hover:shadow-xl transition cursor-pointer"
                onMouseEnter={() => setActiveFeature(idx)}
                onClick={() => setActiveFeature(idx)}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
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
                <p className="text-sm text-gray-600 leading-relaxed">
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
        className="py-16 md:py-24 px-4 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Simple, fast, and efficient</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Capture & Report",
                desc: "Take a photo of the issue and let AI generate the description",
                icon: <Camera />,
              },
              {
                step: "2",
                title: "AI Processing",
                desc: "Google Vision AI classifies and prioritizes your report",
                icon: <Zap />,
              },
              {
                step: "3",
                title: "Track & Resolve",
                desc: "Monitor progress and get notified when it's fixed",
                icon: <CheckCircle />,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-md group-hover:shadow-xl transition-all text-center">
                  <div className="w-14 h-14 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-4 text-blue-600">
                    {React.cloneElement(item.icon, { className: "w-10 h-10" })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {/* Hide arrows on mobile */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
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
                    title: "Faster Response",
                    desc: "AI reduces manual classification time by 80%",
                  },
                  {
                    icon: <Shield />,
                    title: "Improved Safety",
                    desc: "Quick resolution of critical safety issues",
                  },
                  {
                    icon: <BarChart3 />,
                    title: "Data-Driven",
                    desc: "Analytics help identify problem-prone areas",
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
                    <div className="text-2xl sm:text-4xl font-bold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-blue-100 uppercase font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>






















   <section id="Founder-section" className="h-screen w-full bg-white overflow-hidden flex flex-col pt-10">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-2">
            <ShieldCheck size={12} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">The Architectures</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
            THE FOUNDING <span className="text-blue-600">TRIAD.</span>
          </h2>
        </div>

        {/* Full Image Grid - No Scroll */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {founders.map((founder, index) => (
            <div 
              key={index} 
              className="relative group rounded-[3.5rem] overflow-hidden bg-slate-200 shadow-2xl transition-all duration-500"
            >
              {/* IMAGE: Clear at all times. No Blur. */}
              <img 
                src={founder.image} 
                alt={founder.name} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              />

              {/* INITIAL STATE: Light Shadow Overlay (Not full B&W, just a tint) */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-500" />

              {/* HOVER STATE: Glossy Shine streak */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* THE GLASS BOX: Black Drop Filter effect inside the box */}
              <div className="absolute inset-x-6 bottom-6 z-20">
                <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-7 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-2">
                  
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                      {founder.name}
                    </h3>
                    <ArrowUpRight size={20} className="text-blue-400" />
                  </div>
                  
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    {founder.role}
                  </p>
                  
                  {/* Bio and Socials: Hidden until hover */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
                    <p className="text-white/90 text-sm font-medium leading-relaxed mb-6">
                      {founder.bio}
                    </p>

                    <div className="flex gap-3">
                      {Object.entries(founder.social).map(([key, url]) => (
                        <a 
                          key={key} 
                          href={url} 
                          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-blue-600 hover:scale-110 transition-all"
                        >
                          {key === 'li' && <Linkedin size={18} />}
                          {key === 'tw' && <Twitter size={18} />}
                          {key === 'ig' && <Instagram size={18} />}
                          {key === 'gh' && <Github size={18} />}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Badge */}
              <div className="absolute top-8 right-8 bg-black/20 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">
                PARTNER_{founder.name.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>







































      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Your Campus Better?
          </h2>
          <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of students already using Smart Campus to create a
            safer, cleaner environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
              Get Started Now
            </button>
            <button className="px-10 py-4 bg-transparent border-2 border-white/50 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
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
