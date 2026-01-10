import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Award,
  GraduationCap,
  Star,
  Mail,
  Phone,
  Building2,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
// Assuming "collegeData" is passed as a prop or fetched from your MongoDB
export default function CollegeInfo({ collegeData }) {
  // Fallback values for development if data is missing

  const { user } = useAuth();

  const [collegeInfo, setCollegeInfo] = useState({});
  const [collegeDept, setCollegeDept] = useState([]);

  const data = {
    collegeName: collegeInfo?.collegeName ?? "XYZ Institute of Technology",
    address: collegeInfo?.address ?? "Knowledge Park, Sector V, New Delhi",
    NAAC: collegeInfo?.NAAC ?? "N/A",
    officialEmail: collegeInfo?.officialEmail ?? "admin@xyzinstitute.edu",
    officialEmail: collegeInfo?.officialEmail ?? "xyz@gmail.com",
    principalName: collegeInfo?.principalName ?? "Dr. Robert J. Williams",
    description:
      collegeInfo?.description ??
      "A beacon of innovation, dedicated to shaping tomorrow's leaders.",
    departmentName: collegeInfo?.departmentName ?? [],
    logo: collegeInfo?.logo ?? null,
    registrationNumber: collegeInfo?.registrationNumber ?? "N/A",
  };

  const fetchCollegeInfo = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/college/info-limit`, {
        withCredentials: true,
      });

      const dept = res.data.data.departments.map((d) => d.shortCode);

      setCollegeInfo(res.data.data.collegeInfo);
      setCollegeDept(dept);
    } catch (err) {
      console.error("Fetch college info failed", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchCollegeInfo();
  }, [user]);

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-white">
      {/* --- BACKGROUND DESIGN WITH FADE TO WHITE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Mesh Gradient Top Layer */}
        <div className="absolute top-0 left-0 w-full h-[80%] bg-gradient-to-b from-[#bfdcfa]/50 via-[#bfdcfa]/10 to-transparent" />

        {/* Subtle Dots Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#2563eb 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 pb-16  lg:pb-24 pt-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* --- LEFT SIDE: IDENTITY --- */}
          <div className="space-y-10 animate-in slide-in-from-left-8 duration-1000">
            {/* NAAC Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-md border border-blue-100 shadow-sm rounded-2xl">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-700">
                NAAC Accredited: {data.NAAC || "N/A"}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {data.collegeName && (
                  <>
                    {data.collegeName.split(" ").slice(0, -1).join(" ")} <br />
                    <span className="text-blue-600">
                      {data.collegeName.split(" ").slice(-1)}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                {data.description ||
                  "Streamlining campus operations with real-time digital access. Students and staff can now access resources efficiently."}
              </p>
            </div>

            {/* Feature Cards based on Schema Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Address
                  </p>
                  <p className="text-sm font-bold text-slate-800 whitespace-normal break-words">
                    {data.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 shadow-sm rounded-[2rem] hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Contact
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {data.officialEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE MONUMENT --- */}
          <div className="relative flex justify-center lg:justify-end animate-in slide-in-from-right-8 duration-1000">
            {/* Rotating Decorative Background Ring */}
            <div className="absolute inset-0 scale-110 rounded-[4rem] border border-blue-200/40 animate-pulse-slow border-dashed -rotate-6" />

            <div className="relative w-full max-w-[420px] bg-white rounded-[4rem] p-4 shadow-2xl border border-slate-100 group">
              <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white text-center overflow-hidden">
                {/* Logo or Graduation Cap */}
                <div className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  {data.logo ? (
                    <img
                      src={data.logo}
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <GraduationCap
                      size={48}
                      className="text-white opacity-80"
                      strokeWidth={1}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    Academic Hub
                  </h3>
                  <div className="flex justify-center gap-1.5 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Principal Info Card */}
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <User size={18} className="text-blue-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Principal
                      </p>
                      <p className="text-sm font-bold text-white">
                        {data.principalName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Departments Ticker Style */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {collegeDept.slice().map((dept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-300 border border-white/5"
                    >
                      {dept}
                    </span>
                  ))}
                </div>

                {/* Registration Number Footer */}
                <p className="mt-8 text-[10px] font-medium text-slate-500 tracking-widest uppercase">
                  Reg No: {data.registrationNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
