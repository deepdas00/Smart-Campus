import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  KeyRound, ShieldCheck, ArrowLeft, Loader2, 
  Eye, EyeOff, Lock 
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

export default function ChangePassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [step, setStep] = useState(1); // STEP 1 → Verify | STEP 2 → New password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [otpValue, setOtpValue] = useState(""); // storing OTP from backend

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1 → verify old password
  const handleVerifyOldPassword = async () => {
    if (!formData.oldPassword) return toast.error("Enter your current password");

    try {
      setLoading(true);

  
      

      const res = await axios.post(
        `${API_URL}/api/v1/auth/reset-password-verify`,
        { prevPassword: formData.oldPassword },
        { withCredentials: true }
      );

      toast.success("Password verified successfully!");

      setOtpValue(res.data.matchCase);  // Save OTP from backend
      setStep(2); // Move to next step

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → Submit new password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");

    if (formData.newPassword !== formData.confirmPassword)
      return toast.error("Passwords do not match!");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/v1/auth/reset-password-new`,
        {
          newPassword: formData.newPassword,
          matchCase: otpValue, // send OTP for validation
        },
        { withCredentials: true }
      );

      toast.success("Password changed successfully!");
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full z-100">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} className="w-13.5 h-13.5 rounded-full bg-white/60 shadow" />
            <span className="text-xl font-bold bg-blue-700 bg-clip-text text-transparent">
              Smart Campus
            </span>
          </Link>

          <Link 
            to="/profile" 
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
          >
            Cancel
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 pt-16 min-h-screen">

        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center px-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <Lock className="w-8 h-8 text-blue-200" />
            </div>
            <h1 className="text-5xl font-black mb-6">
              Security & Privacy
            </h1>
            <p className="text-xl text-blue-100/80">
              Protect your account by updating your password regularly.
            </p>
          </motion.div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col items-center justify-center p-8 relative">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-[40px] shadow-xl p-10 border border-slate-100"
          >
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Change Password
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                {step === 1
                  ? "Enter your current password"
                  : "Enter your new password"}
              </p>
            </div>

            {/* STEP 1 UI */}
            {step === 1 && (
              <div className="space-y-5">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Current Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  onClick={handleVerifyOldPassword}
                  disabled={loading}
                  className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Next"}
                </button>
              </div>
            )}

            {/* STEP 2 UI */}
            {step === 2 && (
              <form onSubmit={handleChangePassword} className="space-y-5">

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    New Password
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border rounded-2xl font-bold"
                      placeholder="New password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border rounded-2xl font-bold"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Update Password"}
                </button>

              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
