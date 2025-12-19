import React, { useState } from "react";
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../Components/Footer";

export default function LoginPage() {
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log("Login:", { userType, ...formData });
  };

  return (
    <div>
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Link to={"/"} className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                          Smart Campus
                        </span>
                      </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600 hidden sm:inline">Don’t have an account?</span>
                      <Link
                      to={"/signup"}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                        Signup
                      </Link>
                    </div>
                  </div>
                </div>
              </header>
        <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navbar */}

          {/* Left Branding */}
          <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
            <div className="max-w-md">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Smart Campus</h1>
              <p className="text-lg text-white/80">
                Report, track, and resolve campus issues seamlessly with AI-powered insights.
              </p>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="flex items-center justify-center px-4 py-25">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600 mb-8">Login to continue</p>

              {/* Role Switch */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setUserType("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition ${
                    userType === "student"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" /> Student
                </button>
                <button
                  onClick={() => setUserType("institution")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition ${
                    userType === "institution"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Institution
                </button>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="you@campus.edu"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Login */}
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 transition"
              >
                Login <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <Footer/>
    </div>
  );
}
