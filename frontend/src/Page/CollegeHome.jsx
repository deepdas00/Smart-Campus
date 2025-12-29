import React, { useState } from 'react';
import { 
  School, Award, Radio, Save, Plus, Trash2, MapPin, 
  Mail, Phone, User as UserIcon, Image as ImageIcon, 
  Calendar, Hash, Sparkles, ChevronRight, Info, Globe, Bell
} from "lucide-react";

import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer';
import CollegeInfo from '../Components/CollegeInfo';

export default function SmartCollegeAdmin() {
  const [activeTab, setActiveTab] = useState('info');

  // --- DATA STATES ---
  const [collegeData, setCollegeData] = useState({
    code: "GIT-2025",
    name: "Global Institute of Technology",
    email: "admin@git.edu.in",
    personalPhone: "+91 98765 43210",
    officePhone: "022-2544-1234",
    address: "123 Tech Park, Silicon Valley",
    principal: "Dr. Aristhothil Sharma",
    isAutonomous: true,
    universityName: "",
    naacGrade: "A++",
    website: "www.git.edu.in"
  });

  const [gallery, setGallery] = useState([
    { id: 1, title: "Main Campus", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=600" },
    { id: 2, title: "Innovation Lab", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600" }
  ]);

  const [notices, setNotices] = useState([
    { id: 1, type: "Academic", date: "2025-12-28", title: "Semester Results Out", about: "Official results are now live on the student dashboard." }
  ]);

  const gradeStyles = {
    "A++": "bg-emerald-500", "A+": "bg-teal-500", "A": "bg-blue-600",
    "B++": "bg-indigo-600", "B": "bg-orange-500", "C": "bg-rose-600",
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans text-slate-900">
      <Navbar />
      <CollegeInfo />
      
      <div className="pt-14 max-w-[1400px] mx-auto px-6 pb-20">
        
        {/* COMPACT HEADER */}
        <div className="flex justify-between items-center mb-6 bg-slate-900 p-6 rounded-[2rem] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-2xl text-white">
                <Sparkles size={24} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">College <span className="text-blue-400">Admin</span></h1>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm uppercase hover:bg-blue-500 transition-all shadow-lg">
            <Save size={18} /> Save Changes
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'info', label: 'College Profile', icon: School },
            { id: 'visual', label: 'Visual Vision', icon: ImageIcon },
            { id: 'feed', label: 'Live Broadcast', icon: Radio },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl font-bold transition-all border-2 ${
                activeTab === tab.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                : 'bg-white border-transparent text-slate-500 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-base uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --- 1. COLLEGE PROFILE SECTION --- */}
        {activeTab === 'info' && (
          <div className="grid lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-8 bg-[#bbcbff] p-8 rounded-[2.5rem] border border-blue-100 shadow-inner">
              <div className="flex items-center gap-3 mb-8 text-blue-800">
                <Info size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Institutional Identity</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <InputGroup label="College Code" icon={<Hash size={20}/>} value={collegeData.code} onChange={(v)=>setCollegeData({...collegeData, code:v})}/>
                <InputGroup label="Full College Name" icon={<School size={20}/>} value={collegeData.name} onChange={(v)=>setCollegeData({...collegeData, name:v})}/>
                <InputGroup label="Official Email" icon={<Mail size={20}/>} value={collegeData.email} onChange={(v)=>setCollegeData({...collegeData, email:v})}/>
                <InputGroup label="Principal/Dean" icon={<UserIcon size={20}/>} value={collegeData.principal} onChange={(v)=>setCollegeData({...collegeData, principal:v})}/>
                <InputGroup label="Direct Contact" icon={<Phone size={20}/>} value={collegeData.personalPhone} onChange={(v)=>setCollegeData({...collegeData, personalPhone:v})}/>
                <InputGroup label="Office Line" icon={<Phone size={20}/>} value={collegeData.officePhone} onChange={(v)=>setCollegeData({...collegeData, officePhone:v})}/>
              </div>
              <div className="mt-8">
                <label className="text-xs font-black uppercase text-blue-600 mb-2 block tracking-widest">Campus Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-blue-500" size={20}/>
                  <textarea value={collegeData.address} onChange={(e)=>setCollegeData({...collegeData, address:e.target.value})} className="w-full bg-white p-4 pl-12 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-base font-medium h-24 shadow-sm" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-md border-b-4 border-blue-600">
                <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Affiliation Status</h3>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                   <button onClick={() => setCollegeData({...collegeData, isAutonomous:true})} className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all ${collegeData.isAutonomous ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>Autonomous</button>
                   <button onClick={() => setCollegeData({...collegeData, isAutonomous:false})} className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all ${!collegeData.isAutonomous ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>Affiliated</button>
                </div>
                {!collegeData.isAutonomous && (
                  <input placeholder="University Name" value={collegeData.universityName} onChange={(e)=>setCollegeData({...collegeData, universityName:e.target.value})} className="w-full bg-slate-50 p-4 rounded-xl text-base border border-slate-200 outline-none mb-4 font-bold text-center"/>
                )}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-4 text-center">NAAC Grade</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(gradeStyles).map(grade => (
                      <button key={grade} onClick={()=>setCollegeData({...collegeData, naacGrade:grade})} className={`py-2 rounded-lg text-xs font-black transition-all ${collegeData.naacGrade === grade ? `${gradeStyles[grade]} text-white scale-105 shadow-md` : 'bg-slate-50 text-slate-400'}`}>
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                    <h4 className="text-2xl font-black italic mb-2 tracking-tight">{collegeData.name}</h4>
                    <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-lg font-black uppercase">Grade: {collegeData.naacGrade}</div>
                 </div>
                 <School size={100} className="absolute -bottom-4 -right-4 text-white/10 rotate-12" />
              </div>
            </div>
          </div>
        )}

        {/* --- 2. VISUAL VISION (GALLERY) --- */}
        {activeTab === 'visual' && (
          <div className="bg-[#c3f7d3] p-8 rounded-[2.5rem] border border-emerald-100 shadow-inner animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-emerald-800">
                <ImageIcon size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Campus Gallery</h2>
              </div>
              <button onClick={() => setGallery([...gallery, {id: Date.now(), title: "New Asset", url: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=600"}])} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase flex items-center gap-2 hover:bg-emerald-500 shadow-lg">
                <Plus size={18}/> Add Photo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((img, idx) => (
                <div key={img.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                  <img src={img.url} alt={img.title} className="w-full h-40 object-cover" />
                  <div className="p-4 bg-white">
                    <input value={img.title} onChange={(e) => {const g=[...gallery]; g[idx].title=e.target.value; setGallery(g)}} className="w-full font-bold text-base outline-none text-slate-700 border-b border-transparent focus:border-emerald-200" placeholder="Title..."/>
                    <button onClick={() => setGallery(gallery.filter(g=>g.id!==img.id))} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. LIVE BROADCAST (NOTIFICATIONS) --- */}
        {activeTab === 'feed' && (
          <div className="bg-[#ffe0ba] p-8 rounded-[2.5rem] border border-orange-100 shadow-inner animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3 text-orange-800">
                <Bell size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Announcement Center</h2>
              </div>
              <button onClick={() => setNotices([{id:Date.now(), type:'General', date: new Date().toISOString().split('T')[0], title:'', about:''}, ...notices])} className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase flex items-center gap-2 hover:bg-orange-500 shadow-lg">
                <Plus size={18}/> New Feed
              </button>
            </div>
            <div className="space-y-4">
              {notices.map((note, idx) => (
                <div key={note.id} className="grid lg:grid-cols-12 gap-4 p-6 bg-white rounded-3xl items-start border-2 border-slate-100 hover:border-orange-300 transition-all shadow-sm">
                  <div className="lg:col-span-3 space-y-2">
                    <select value={note.type} onChange={(e)=>{const n=[...notices]; n[idx].type=e.target.value; setNotices(n)}} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-black uppercase text-orange-600 border border-slate-200 outline-none">
                      <option>Academic</option><option>Security</option><option>Events</option><option>Holiday</option>
                    </select>
                    <input type="date" value={note.date} onChange={(e)=>{const n=[...notices]; n[idx].date=e.target.value; setNotices(n)}} className="w-full bg-slate-50 p-3 rounded-xl text-sm font-bold text-slate-500 border border-slate-200 outline-none"/>
                  </div>
                  <div className="lg:col-span-8 space-y-2">
                    <input placeholder="Announcement Title..." value={note.title} onChange={(e)=>{const n=[...notices]; n[idx].title=e.target.value; setNotices(n)}} className="w-full bg-transparent text-lg font-black uppercase outline-none text-slate-800"/>
                    <textarea placeholder="Brief description..." value={note.about} onChange={(e)=>{const n=[...notices]; n[idx].about=e.target.value; setNotices(n)}} className="w-full bg-transparent text-base text-slate-500 outline-none resize-none h-12"/>
                  </div>
                  <div className="lg:col-span-1 flex justify-end">
                    <button onClick={() => setNotices(notices.filter(n=>n.id!==note.id))} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}

// Reusable Input Component with improved font sizing
function InputGroup({ label, icon, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-black uppercase text-blue-600 ml-1 tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">{icon}</div>
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white p-3.5 pl-12 rounded-xl border-2 border-slate-200 focus:border-blue-400 outline-none font-bold text-base text-slate-700 transition-all shadow-sm"
        />
      </div>
    </div>
  );
}