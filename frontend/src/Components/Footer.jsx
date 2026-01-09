import React from "react";
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
import logo from "../assets/logo.png";

function Footer() {
  return (
  <footer className="bg-gray-900 text-gray-300 py-12 px-4">
  <div className="max-w-7xl mx-auto">
    
    {/* GRID — mobile:1, tablet:2, desktop:4 */}
    <div className="grid grid-cols-1 grid-cols-3 md:grid-cols-4 gap-8 mb-12">

  {/* 1️⃣ Logo + About — full width on phone, 1 column on laptop */}
  <div className="col-span-3 md:col-span-1">
    <div className="flex flex-col justify-center items-start text-left">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={logo}
          alt="Smart Campus Logo"
          className="md:w-16 md:h-16 w-14 h-14 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
        />
        <span className="text-white font-bold md:text-lg text-2xl">Smart Campus</span>
      </div>
      <p className="text-sm w-full flex justify-center items-center text-justify">
        Smart Campus is a unified digital platform that streamlines campus operations—from issue reporting to essential services—all in one intelligent system.
      </p>
    </div>
  </div>

  {/* 2️⃣ Product */}
  <div>
    <h4 className="text-white font-semibold mb-4">Product</h4>
    <ul className="space-y-2 text-sm">
      <li><a href="#" className="hover:text-white transition">Features</a></li>
      <li><a href="#" className="hover:text-white transition">Pricing</a></li>
      <li><a href="#" className="hover:text-white transition">Demo</a></li>
    </ul>
  </div>

  {/* 3️⃣ Company */}
  <div>
    <h4 className="text-white font-semibold mb-4">Company</h4>
    <ul className="space-y-2 text-sm">
      <li><a href="#" className="hover:text-white transition">About</a></li>
      <li><a href="#" className="hover:text-white transition">Contact</a></li>
      <li><a href="#" className="hover:text-white transition">Careers</a></li>
    </ul>
  </div>

  {/* 4️⃣ Legal */}
  <div>
    <h4 className="text-white font-semibold mb-4">Legal</h4>
    <ul className="space-y-2 text-sm">
      <li><a href="#" className="hover:text-white transition">Privacy</a></li>
      <li><a href="#" className="hover:text-white transition">Terms</a></li>
      <li><a href="#" className="hover:text-white transition">Security</a></li>
    </ul>
  </div>
</div>


    {/* Bottom */}
    <div className="border-t border-gray-800 pt-8 text-center text-sm">
      <p>
        © 2026 Smart Campus. Empowering campuses with seamless digital experiences.
      </p>
    </div>

  </div>
</footer>

  );
}

export default Footer;
