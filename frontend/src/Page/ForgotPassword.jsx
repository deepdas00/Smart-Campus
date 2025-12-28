import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Building2, User, KeyRound, 
  ShieldCheck, Loader2, ArrowRight,GraduationCap , Eye, EyeOff 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [showPassword, setShowPassword] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    collegeCode: "",
    loginId: "",
    otp: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 1: Send OTP ---
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/v1/college/forgot-password`, {
        collegeCode: formData.collegeCode,
        loginId: formData.loginId
      });
      toast.success(res.data.message || "OTP sent successfully!");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "User not found or Server error");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Verify OTP & Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.otp.length < 4) return toast.error("Please enter a valid OTP");
    if (formData.newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      // Matches your backend: { collegeCode, loginId, otp, newPassword }
      const res = await axios.post(`${API_URL}/api/v1/college/reset-password`, {
        collegeCode: formData.collegeCode,
        loginId: formData.loginId,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      toast.success("Password reset successfully! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed. Check OTP or Expiry.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <>

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

              <Link

                to={"/signup"}

                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"

              >

                Signup

              </Link>

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
            <p className="text-lg text-white/80">Manage your academic life, library, and canteen needs in one place.</p>
          </div>
        </div>
      
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">

    


      <Link to="/login" className="absolute top-10 left-10 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-bold text-sm uppercase tracking-wider">
        <ArrowLeft size={16} /> Back to Login
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 p-10 border border-slate-100"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <img src={logo} alt="Smart Campus" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {step === 1 ? "Recovery Mode" : "Reset Password"}
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {step === 1 
              ? "Identify your account to receive a security code." 
              : "Verify your OTP and choose a strong new password."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">College Code</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" name="collegeCode" value={formData.collegeCode} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                    placeholder="e.g. 130" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Login ID / Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" name="loginId" value={formData.loginId} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                    placeholder="Enter your registered ID" 
                  />
                </div>
              </div>

              <button disabled={loading} type="submit" 
                className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-900 shadow-lg shadow-blue-200 transition-all disabled:opacity-70 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Get OTP <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></>}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">OTP Code</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type="text" name="otp" maxLength={6} value={formData.otp} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all tracking-[0.6em] font-black text-slate-700"
                    placeholder="000000" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input required type={showPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                    placeholder="Create new password" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button disabled={loading} type="submit" 
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
              </button>
              
              <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition">
                Back to Identity Check
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>


</div>


    </>
  );
}