import React, { useState, useRef } from 'react';
import { 
  LayoutGrid, Bell, School, Award, FileText, Settings, Trophy, Gamepad2, 
  Shield, Cpu, Eye, Save, ArrowRight, Plus, Trash2, Camera, Globe, Zap,
  Monitor, Cloud, Maximize2, Filter
} from "lucide-react";

import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer';
import CollegeInfo from '../Components/CollegeInfo';

export default function SmartCollegeAdmin() {
  const [activeTab, setActiveTab] = useState('about');
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // --- 1. BRANDING STATE ---
  const [collegeName, setCollegeName] = useState("Global Institute of Technology");
  
  // --- 2. NAAC STATE ---
  const [naacGrade, setNaacGrade] = useState("A++");
  const gradeColors = {
    "A++": "text-emerald-500 bg-emerald-50 border-emerald-200 shadow-emerald-100",
    "A+": "text-green-500 bg-green-50 border-green-200 shadow-green-100",
    "A": "text-blue-500 bg-blue-50 border-blue-200 shadow-blue-100",
    "B++": "text-indigo-500 bg-indigo-50 border-indigo-200 shadow-indigo-100",
    "B": "text-amber-500 bg-amber-50 border-amber-200 shadow-amber-100",
    "C": "text-rose-500 bg-rose-50 border-rose-200 shadow-rose-100",
  };

  // --- 3. ABOUT DASHBOARD STATE ---
  const [aboutTitle, setAboutTitle] = useState("Smart");
  const [aboutSubtitle, setAboutSubtitle] = useState("Campus.");
  const [aboutDescription, setAboutDescription] = useState("Revolutionizing the student experience through seamless integration.");
  const [stats, setStats] = useState({ partners: "50+", uptime: "24/7" });
  const [features, setFeatures] = useState([
    { icon: Trophy, label: "Hackathons", color: "text-orange-500" },
    { icon: Gamepad2, label: "Events", color: "text-pink-500" },
    { icon: Shield, label: "Security", color: "text-blue-500" },
    { icon: Cpu, label: "Digitalized", color: "text-purple-500" }
  ]);

  // --- 4. VAULT / GALLERY STATE ---
  const [galleryItems, setGalleryItems] = useState([
    { id: 1, title: "Main Campus Aerial", category: "Infrastructure" },
    { id: 2, title: "Tech Symposium 2025", category: "Events" },
    { id: 3, title: "Robotics Lab", category: "Academic" },
  ]);

  // --- 5. BROADCAST FEED STATE ---
  const [notices, setNotices] = useState([
    { id: 1, title: "Semester Results 2025 Deployment", type: "Academic", date: "Dec 27" },
    { id: 2, title: "Cyber Security Protocol Update", type: "Security", date: "Dec 26" }
  ]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setScrollProgress((scrollLeft / (scrollWidth - clientWidth)) * 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <CollegeInfo />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* GLOBAL HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg">
              <Settings size={24} className="animate-spin-slow" />
            </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Master <span className="text-blue-600">Terminal</span></h2>
          </div>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">
             <Save size={16} /> Save All Sections
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-200 sticky top-10">
              <nav className="space-y-1">
                {[
                  { id: 'branding', label: 'College Name', icon: School },
                  { id: 'naac', label: 'NAAC Ranking', icon: Award },
                  { id: 'about', label: 'About Dash', icon: FileText },
                  { id: 'gallery', label: 'Visual Vault', icon: LayoutGrid },
                  { id: 'notices', label: 'Broadcast', icon: Bell },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                      activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9 space-y-8 text-left">
            
            {/* 1. BRANDING SECTION */}
            {activeTab === 'branding' && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 animate-in fade-in">
                <h3 className="text-lg font-black italic uppercase mb-6 border-l-4 border-blue-600 pl-3">Institution Name</h3>
                <input value={collegeName} onChange={(e)=>setCollegeName(e.target.value)} className="w-full bg-slate-50 p-5 rounded-xl text-lg font-bold outline-none" />
              </div>
            )}

            {/* 2. NAAC SECTION (DYNAMIC COLORS) */}
            {activeTab === 'naac' && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 animate-in fade-in">
                <h3 className="text-lg font-black italic uppercase mb-6 border-l-4 border-blue-600 pl-3">NAAC Ranking</h3>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="grid grid-cols-3 gap-2">
                        {Object.keys(gradeColors).map(grade => (
                            <button key={grade} onClick={() => setNaacGrade(grade)} className={`py-3 rounded-lg font-black text-xs border ${naacGrade === grade ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}>{grade}</button>
                        ))}
                    </div>
                    <div className={`p-10 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center ${gradeColors[naacGrade]}`}>
                        <Award size={40} className="mb-2" /><span className="text-5xl font-black italic uppercase">{naacGrade}</span>
                    </div>
                </div>
              </div>
            )}

            {/* 3. ABOUT DASHBOARD SECTION */}
            {activeTab === 'about' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-black italic uppercase mb-6 border-l-4 border-blue-600 pl-3">About Editor</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input value={aboutTitle} onChange={(e)=>setAboutTitle(e.target.value)} className="bg-slate-50 rounded-xl p-4 text-lg font-bold outline-none" />
                    <input value={aboutSubtitle} onChange={(e)=>setAboutSubtitle(e.target.value)} className="bg-slate-50 rounded-xl p-4 text-lg font-bold text-blue-600 outline-none" />
                  </div>
                  <textarea value={aboutDescription} onChange={(e)=>setAboutDescription(e.target.value)} className="w-full h-24 bg-slate-50 rounded-xl p-4 text-base font-medium outline-none mb-4" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input value={stats.partners} onChange={(e)=>setStats({...stats, partners: e.target.value})} className="bg-slate-50 p-4 rounded-xl font-black text-yellow-600 outline-none" />
                    <input value={stats.uptime} onChange={(e)=>setStats({...stats, uptime: e.target.value})} className="bg-slate-50 p-4 rounded-xl font-black text-blue-600 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {features.map((f, i) => (
                      <input key={i} value={f.label} onChange={(e)=>{const n=[...features]; n[i].label=e.target.value; setFeatures(n)}} className="bg-slate-50 p-3 rounded-lg text-center text-[10px] font-black uppercase outline-none border border-slate-100" />
                    ))}
                  </div>
                </div>
                <section className="py-16 px-6 bg-gradient-to-br from-blue-700 via-blue-900 to-black text-white rounded-[3rem] shadow-xl grid lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{aboutTitle} <br /><span className="text-yellow-300 underline decoration-4 underline-offset-4">{aboutSubtitle}</span></h2>
                        <p className="text-blue-100/70 text-base leading-relaxed italic">{aboutDescription}</p>
                        <div className="flex gap-4"><div className="bg-white/5 p-6 rounded-2xl flex-1"><p className="text-3xl font-black text-yellow-300">{stats.partners}</p><p className="text-[9px] font-black uppercase text-blue-200 mt-1">Partners</p></div><div className="bg-white/5 p-6 rounded-2xl flex-1"><p className="text-3xl font-black text-yellow-300">{stats.uptime}</p><p className="text-[9px] font-black uppercase text-blue-200 mt-1">Uptime</p></div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((item, idx) => (
                            <div key={idx} className={`bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-lg ${idx % 2 !== 0 ? 'translate-y-6' : ''}`}>
                                <div className={`mb-3 ${item.color}`}><item.icon size={32} /></div>
                                <h5 className="font-black text-slate-900 uppercase text-[10px] italic tracking-widest">{item.label}</h5>
                            </div>
                        ))}
                    </div>
                </section>
              </div>
            )}

            {/* 4. VISUAL VAULT SECTION (REFILLS EMPTY SPACE) */}
            {activeTab === 'gallery' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black italic uppercase border-l-4 border-blue-600 pl-3">Visual Vault</h3>
                        <button onClick={()=>setGalleryItems([...galleryItems, {id: Date.now(), title: "New Asset", category: "General"}])} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-black uppercase text-[10px] flex items-center gap-2"><Plus size={14}/> Add Media</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {galleryItems.map((item, idx) => (
                            <div key={item.id} className="bg-slate-50 p-5 rounded-[2rem] border-2 border-transparent hover:border-blue-100 transition-all">
                                <div className="aspect-video bg-slate-200 rounded-2xl mb-4 flex items-center justify-center"><Camera size={32} className="text-slate-300" /></div>
                                <input value={item.title} onChange={(e)=>{const n=[...galleryItems]; n[idx].title=e.target.value; setGalleryItems(n)}} className="w-full bg-transparent font-bold text-sm outline-none mb-2" />
                                <button onClick={()=>setGalleryItems(galleryItems.filter(g=>g.id!==item.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {/* 5. BROADCAST FEED SECTION */}
            {activeTab === 'notices' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black italic uppercase border-l-4 border-blue-600 pl-3">Live Feed</h3>
                        <button onClick={()=>setNotices([{id: Date.now(), title: "New Broadcast", type: "Alert", date: "Now"}, ...notices])} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase text-[10px]"><Plus size={14}/></button>
                    </div>
                    <div className="space-y-3">
                        {notices.map((note, idx) => (
                            <div key={note.id} className="flex gap-4 bg-slate-50 p-4 rounded-xl items-center"><input value={note.title} onChange={(e)=>{const n=[...notices]; n[idx].title=e.target.value; setNotices(n)}} className="flex-1 bg-transparent text-sm font-black italic outline-none" /><button onClick={()=>setNotices(notices.filter(n=>n.id!==note.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button></div>
                        ))}
                    </div>
                </div>
                <section className="py-16 px-6 bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="flex justify-between items-center mb-10"><h2 className="text-4xl font-black italic uppercase text-slate-900">Live <span className="text-blue-600">Feed.</span></h2><div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl"><span className="text-xs font-black text-blue-600 italic">{Math.round(scrollProgress)}%</span><div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${scrollProgress}%` }}></div></div></div></div>
                    <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto gap-6 pb-6 modern-scroll snap-x snap-mandatory px-4">
                        {notices.map((note) => (
                            <div key={note.id} className="min-w-[300px] snap-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-md">
                                <div className="flex items-center gap-2 mb-6"><div className="w-1.5 h-6 bg-blue-600 rounded-full"></div><span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">{note.type}</span></div>
                                <h4 className="text-xl font-black text-slate-900 leading-tight italic uppercase">{note.title}</h4>
                            </div>
                        ))}
                    </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `.modern-scroll::-webkit-scrollbar { display: none; } @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 15s linear infinite; }`}} />
    </div>
  );
}