import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Building2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // --- STATE ---
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const [formData, setFormData] = useState({
    collegeCode: "",
    email: "",
    mobileNo: "",
    password: "",
    loginId: "",
  });

  const [forgotData, setForgotData] = useState({
    collegeCode: "",
    loginId: "",
  });

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      let payload = {
        collegeCode: formData.collegeCode,
        password: formData.password,
      };
      let url = "";

      if (userType === "student") {
        payload = {
          ...payload,
          ...(loginMethod === "email"
            ? { loginId: formData.email }
            : { mobileNo: formData.mobileNo }),
        };
        url = `${API_URL}/api/v1/auth/student/login`;
      } else {
        payload = { ...payload, loginId: formData.loginId };
        url = `${API_URL}/api/v1/auth/staff/login`;
      }


      
      
      const res = await axios.post(url, payload, { withCredentials: true });
      const userData = res.data.data || res.data.user;

      if (userData) {
        setUser(userData);
        toast.success("Welcome back!");
        const routes = {
          student: "/profile",
          canteen: "/kitchen",
          librarian: "/library-admin",
          admin: "/admin",
        };
        navigate(routes[userData.role] || "/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/college/forgot-password`,
        {
          collegeCode: forgotData.collegeCode,
          loginId: forgotData.loginId,
        }
      );
      toast.success(res.data.message || "OTP sent to registered email/mobile");
      setShowForgotModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset request"
      );
    }
  };

  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [filteredColleges, setFilteredColleges] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const dropdownRef = useRef();


useEffect(() => {
  const fetchColleges = async () => {
    try {
      setLoadingColleges(true);
      const response = await axios.get(`${API_URL}/api/v1/college/data`);

      
      if (response.data?.data) {
        setColleges(response.data.data);
        setFilteredColleges(response.data.data); // initialize dropdown
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
    } finally {
      setLoadingColleges(false);
    }
  };

  fetchColleges();
}, []);




useEffect(() => {
  setFilteredColleges(colleges);
}, [colleges]);

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const handleCollegeSearch = (e) => {
  const query = e.target.value;
  setFormData({ ...formData, collegeCode: query });

  if (!query) {
    setFilteredColleges(colleges);
  } else {
    const filtered = colleges.filter(
      (c) =>
        (c.collegeName &&
          c.collegeName.toLowerCase().includes(query.toLowerCase())) ||
        (c.collegeCode &&
          c.collegeCode.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredColleges(filtered);
  }
  setShowDropdown(true);
};

const handleSelectCollege = (code) => {
  setFormData({ ...formData, collegeCode: code });
  setShowDropdown(false);
};

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isSubmitting ? "blur-sm grayscale" : ""
      }`}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />

                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden sm:inline">
                Don’t have an account?
              </span>

              
            </div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 pt-16">
        {/* Left Branding */}
        <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-blue-700 to-blue-900 text-white min-h-screen">
          <div className="max-w-md">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Smart Campus Portal</h1>
            <p className="text-lg text-white/80">
              Manage your academic life, library, and canteen needs in one
              place.
            </p>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="flex items-center justify-center px-4 py-12 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome Back
            </h2>

            {/* User Type Switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setUserType("student")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                  userType === "student"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <GraduationCap className="w-4 h-4" /> Student
              </button>
              <button
                onClick={() => setUserType("institution")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
                  userType === "institution"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500"
                }`}
              >
                <Building2 className="w-4 h-4" /> Institution
              </button>
            </div>














            {/* College Code Field */}
            {/* <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                College Code
              </label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="collegeCode"
                  value={formData.collegeCode}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter College Code"
                />
              </div>
            </div> */}

















<div className="mb-4 relative" ref={dropdownRef}>
  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
    College Code
  </label>
  <div className="relative mt-1">
    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      name="collegeCode"
      value={formData.collegeCode}
      onChange={handleCollegeSearch}
      onFocus={() => setShowDropdown(true)}
      placeholder="Type or select College Code"
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      autoComplete="off"
    />

    {showDropdown && filteredColleges.length > 0 && (
      <ul className="absolute z-50 w-full bg-gray-200 border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
        {filteredColleges.map((college) => (
          <li
            key={college.collegeCode}
            onMouseDown={(e) => {
              e.preventDefault(); // prevents blur before selection
              handleSelectCollege(college.collegeCode);
            }}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
          >
             ({college.collegeCode}) {college.collegeName}
          </li>
        ))}
      </ul>
    )}

    {showDropdown && filteredColleges.length === 0 && (
      <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 p-2 text-gray-400">
        No colleges found
      </div>
    )}
  </div>
</div>







            {/* Student Specific Toggle */}
            {userType === "student" && (
              <div className="flex bg-gray-50 rounded-lg p-1 mb-4 border border-gray-100">
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition ${
                    loginMethod === "email"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-400"
                  }`}
                >
                  EMAIL
                </button>
                <button
                  onClick={() => setLoginMethod("mobile")}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition ${
                    loginMethod === "mobile"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-400"
                  }`}
                >
                  MOBILE
                </button>
              </div>
            )}

            {/* Dynamic Input Fields */}
            <div className="space-y-4">
              {userType === "student" ? (
                loginMethod === "email" ? (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="student@college.edu"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="10-digit number"
                    />
                  </div>
                )
              ) : (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Login ID
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="loginId"
                      value={formData.loginId}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Staff/Admin ID"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")} // Navigate to the new page
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>




            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="w-full mt-4 py-4 bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition disabled:opacity-50"
            >
              {isSubmitting ? "Authenticating..." : "Login Now"}{" "}
              <ArrowRight className="w-5 h-5" />
            </button>

            
          </motion.div>
        </div>
      </div>



      {/* --- FORGOT PASSWORD MODAL --- */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Reset Password</h3>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Enter your details to receive a password reset link/OTP.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    College Code
                  </label>
                  <input
                    required
                    type="text"
                    name="collegeCode"
                    value={forgotData.collegeCode}
                    onChange={handleForgotChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 101"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Login ID / Email
                  </label>
                  <input
                    required
                    type="text"
                    name="loginId"
                    value={forgotData.loginId}
                    onChange={handleForgotChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your registered ID"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Request Reset
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
