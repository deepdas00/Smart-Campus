// import { MapPin, Award, Sparkles, GraduationCap, Mail, ShieldCheck, Globe } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function CollegeInfo() {
//   const { user } = useAuth();
//   const [collegeInfo, setCollegeInfo] = useState(null);

//   const fetchCollegeInfo = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/v1/college/info-limit`, {
//         withCredentials: true,
//       });
//       setCollegeInfo(res.data.data);
//     } catch (err) {
//       console.error("Fetch failed", err);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchCollegeInfo();
//   }, [user]);

//   if (!collegeInfo) return <div className="h-[45vh] bg-slate-50 animate-pulse rounded-[2rem]" />;

//   return (
//     // <section className="relative h-[45vh] w-full bg-white border border-blue-100 rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden font-sans">
      
//     //   {/* Decorative Background Accent */}
//     //   <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
//     //   <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl" />

//     //   <div className="relative h-full max-w-7xl mx-auto px-10 py-8 flex flex-col justify-between">
        
//     //     {/* Header Section */}
//     //     <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
//     //       <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
//     //         {/* Logo with Ring */}
//     //         <div className="relative group">
//     //           <div className="absolute -inset-2 bg-blue-100 rounded-3xl scale-95 group-hover:scale-105 transition-transform duration-500 opacity-50" />
//     //           <img 
//     //             src={collegeInfo.logo} 
//     //             className="relative w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" 
//     //             alt="College Logo"
//     //           />
//     //         </div>

//     //         <div className="text-center md:text-left">
//     //           <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
//     //             <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">
//     //               {collegeInfo.collegeName}
//     //             </h1>
//     //             <div className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase">
//     //               <ShieldCheck className="w-3 h-3" />
//     //               Code: {collegeInfo.collegeCode}
//     //             </div>
//     //           </div>
              
//     //           <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-3 text-slate-500">
//     //             <span className="flex items-center gap-1.5 text-sm font-medium">
//     //               <MapPin className="w-4 h-4 text-blue-500" />
//     //               {collegeInfo.address}
//     //             </span>
//     //             <span className="flex items-center gap-1.5 text-sm font-medium border-l border-slate-200 pl-4">
//     //               <Mail className="w-4 h-4 text-blue-500" />
//     //               {collegeInfo.officialEmail}
//     //             </span>
//     //           </div>
//     //         </div>
//     //       </div>

//     //       {/* NAAC Accreditation Card */}
//     //       <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-[1px] rounded-2xl shadow-lg shadow-blue-200">
//     //         <div className="bg-white rounded-[15px] px-6 py-3 flex items-center gap-4">
//     //            <div className="text-center">
//     //               <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none mb-1">Grade</p>
//     //               <p className="text-3xl font-black text-blue-900 leading-none">{collegeInfo.NAAC}</p>
//     //            </div>
//     //            <div className="h-8 w-[1px] bg-slate-100" />
//     //            <Award className="w-8 h-8 text-blue-600" />
//     //         </div>
//     //       </div>
//     //     </div>

//     //     {/* Description Section */}
//     //     <div className="max-w-4xl">
//     //       <p className="text-slate-600 text-base leading-relaxed line-clamp-2 italic border-l-4 border-blue-200 pl-6">
//     //         {collegeInfo.description}
//     //       </p>
//     //     </div>

//     //     {/* Footer: Departments & Status */}
//     //     <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-50">
//     //       <div className="flex flex-wrap items-center gap-2">
//     //         <span className="text-xs font-bold text-blue-900/40 uppercase tracking-widest mr-2 flex items-center gap-1">
//     //           <GraduationCap className="w-4 h-4" /> Departments:
//     //         </span>
//     //         {collegeInfo.departmentName?.slice(0, 5).map((dept, i) => (
//     //           <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all cursor-default">
//     //             {dept}
//     //           </span>
//     //         ))}
//     //         {collegeInfo.departmentName?.length > 5 && (
//     //           <span className="text-xs text-slate-400 font-medium ml-1">+{collegeInfo.departmentName.length - 5} more</span>
//     //         )}
//     //       </div>

//     //       <div className="flex items-center gap-4">
//     //          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//     //             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//     //             Active Campus
//     //          </div>
//     //          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-200 active:scale-95">
//     //             <Sparkles className="w-4 h-4" />
//     //             Explore Portal
//     //          </button>
//     //       </div>
//     //     </div>

//     //   </div>
//     // </section>
//     <></>
//   );
// }