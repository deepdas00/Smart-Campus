import React, { useState } from 'react';
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
  X
} from "lucide-react";

import { Link } from "react-router-dom";
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar/Navbar';

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
      description: "Snap a photo and report issues in seconds with AI-powered descriptions"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Tracking",
      description: "Auto-detect and pin exact locations using Google Maps integration"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Classification",
      description: "Google Vision AI automatically categorizes and prioritizes issues"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Real-Time Updates",
      description: "Get notified instantly when your reported issues are resolved"
    }
  ];

  const stats = [
    { value: "500+", label: "Issues Resolved" },
    { value: "2.5 Days", label: "Avg Response Time" },
    { value: "95%", label: "Success Rate" },
    { value: "1000+", label: "Active Users" }
  ];

  const issueTypes = [
    { name: "Electrical", color: "bg-yellow-500", icon: "⚡" },
    { name: "Water/Plumbing", color: "bg-blue-500", icon: "💧" },
    { name: "Sanitation", color: "bg-green-500", icon: "🧹" },
    { name: "Infrastructure", color: "bg-red-500", icon: "🏗️" },
    { name: "Safety", color: "bg-purple-500", icon: "🛡️" },
    { name: "Other", color: "bg-gray-500", icon: "📋" }
  ];

  return (
    <div id='home' className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <Navbar/>

      {/* Hero Section */}
      <section className={`${user ? "pt-15" : "p-35"} px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Powered by Google AI</span>
              </div>
              
             <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">

                Report Campus Issues{' '}
                <span className="bg-blue-600 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                An AI-powered platform to report, track, and resolve campus infrastructure issues efficiently. Make your campus safer and better.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Report an Issue</span>
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:shadow-lg transition border-2 border-gray-200 flex items-center justify-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>View Dashboard</span>
                </button>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:space-x-8">

                {stats.slice(0, 3).map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
             <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-5 sm:p-8 shadow-2xl">

                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Recent Reports</span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Live</span>
                  </div>
                  
                  {[
                    { issue: "Broken light in Library", status: "Resolved", time: "2m ago", color: "green" },
                    { issue: "Water leakage in Hostel B", status: "In Progress", time: "15m ago", color: "yellow" },
                    { issue: "Damaged road near Gate 2", status: "Reported", time: "1h ago", color: "blue" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                     <div className={`w-2 h-2 rounded-full ${statusStyles[item.color].dot}`}></div>

                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.issue}</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${statusStyles[item.color].badge}`}>

                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {issueTypes.slice(0, 3).map((type, idx) => (
                    <div key={idx} className={`${type.color} rounded-xl p-4 text-white text-center hover:scale-105 transition`}>
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Better Campus
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge Google AI technologies to streamline issue reporting and resolution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition cursor-pointer"
               onMouseEnter={() => setActiveFeature(idx)}
onClick={() => setActiveFeature(idx)}

              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                  activeFeature === idx 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                } transition`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple, fast, and efficient</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Capture & Report", desc: "Take a photo of the issue and let AI generate the description", icon: <Camera /> },
              { step: "2", title: "AI Processing", desc: "Google Vision AI classifies and prioritizes your report", icon: <Zap /> },
              { step: "3", title: "Track & Resolve", desc: "Monitor progress and get notified when it's fixed", icon: <CheckCircle /> }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
                  <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                    {item.step}
                  </div>
                  <div className="flex justify-center mb-4 text-blue-600">
                    {React.cloneElement(item.icon, { className: "w-12 h-12" })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Real-World Impact
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Transforming campus maintenance with transparency, speed, and data-driven decisions
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Zap className="w-6 h-6" />, title: "Faster Response", desc: "AI reduces manual classification time by 80%" },
                  { icon: <Shield className="w-6 h-6" />, title: "Improved Safety", desc: "Quick resolution of critical safety issues" },
                  { icon: <BarChart3 className="w-6 h-6" />, title: "Data-Driven", desc: "Analytics help identify problem-prone areas" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8">Platform Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">

            Ready to Make Your Campus Better?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of students already using Smart Campus to create a safer, cleaner environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-2xl transition">
              Get Started Now
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}