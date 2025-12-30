import React, { useState } from 'react';
import { 
  School, Hash, Mail, User, Phone, MapPin, Database, FileText, 
  CheckCircle, Award, UploadCloud, Globe, Users, Layers, 
  ArrowRight, ShieldCheck, Landmark, Zap, 
  Target, HelpCircle, ChevronRight, LayoutGrid,
  Cpu, Network, DollarSign, Activity, AlertCircle, Building2, Briefcase
} from "lucide-react";
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer';

export default function AdminOwner() {
  const [activeSection, setActiveSection] = useState('identity');
  const [logo, setLogo] = useState(null);

  const [formData, setFormData] = useState({
    collegeName: '', collegeCode: '', instType: 'Private', university: '', naac: 'A++',
    address: '', city: '', state: '', pin: '',
    pocName: '', pocDesignation: '', pocEmail: '', pocPhone: '',
    leadSource: '', currentStatus: 'Interested', timeline: '1-3 months',
    modules: [],
    currentERP: 'No', erpProblems: [],
    internet: 'Good', wifi: 'Full', serverPref: 'Cloud',
    studentCount: '', facultyCount: '',
    gst: '', billingAddress: '',
  });

  const sections = [
    { id: 'identity', label: 'Institutional Identity', icon: <Landmark size={16} /> },
    { id: 'leadership', label: 'Decision Makers', icon: <Briefcase size={16} /> },
    { id: 'product', label: 'License & Scope', icon: <LayoutGrid size={16} /> },
    { id: 'infra', label: 'Cloud Infrastructure', icon: <Cpu size={16} /> },
    { id: 'billing', label: 'Legal & Billing', icon: <FileText size={16} /> },
  ];

  const modulesList = [
    "Attendance AI", "Digital Library", "Smart Canteen", "Hostel Pro", 
    "Fin-Pay", "Exam Core", "LMS+", "Secure Gate", "Fleet Track", "Mobile App"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleModule = (mod) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(mod) 
        ? prev.modules.filter(m => m !== mod) 
        : [...prev.modules, mod]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-100 font-sans">
      <Navbar />
      
      {/* --- EXECUTIVE HEADER --- */}
      <div className="pt-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-xl text-white shadow-xl shadow-slate-200">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase tracking-tighter">
                Provisioning <span className="text-blue-600">Console</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Founder Access Level</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-slate-400 uppercase">Status: <span className="text-amber-500 italic px-2">Pending Deployment</span></span>
             <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
               <Zap size={14} className="fill-current" /> Deploy Instance
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-10 flex gap-12">
        
        {/* --- NAVIGATION SIDEBAR --- */}
        <aside className="w-72 hidden lg:block sticky top-48 h-fit space-y-8">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold text-[13px] ${
                  activeSection === s.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {s.icon} {s.label}
                </div>
                {activeSection === s.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>
          
          {/* NODE METRICS PANEL */}
          <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-2xl shadow-slate-300">
            <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Live Node Stats</h4>
            <div className="space-y-4">
              <MetricRow label="Data Integrity" value="98%" color="blue" />
              <MetricRow label="API Readiness" value="Active" color="green" />
              <MetricRow label="Licensing" value="Enterprise" color="purple" />
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT ENGINE --- */}
        <main className="flex-1 space-y-10">
          
          {/* IDENTITY SECTION */}
          <section id="identity" className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-12 transition-all hover:shadow-md">
            <SectionHeader title="Core Institution Identity" icon={<Building2 />} index="01" />
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Brand Mark</label>
                <div className="h-52 rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative group transition-all hover:border-blue-400 hover:bg-blue-50/20">
                  {logo ? (
                    <img src={logo} className="w-full h-full object-contain p-8" alt="logo" />
                  ) : (
                    <div className="text-center">
                       <UploadCloud className="text-slate-300 w-12 h-12 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Click to Upload</p>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setLogo(URL.createObjectURL(e.target.files[0]))} />
                </div>
              </div>
              <div className="md:col-span-2 grid md:grid-cols-2 gap-x-8 gap-y-10">
                <ModernField label="College Legal Name" name="collegeName" placeholder="Full Registered Title" />
                <ModernField label="Node Identifier" name="collegeCode" placeholder="STFD-2025-01" />
                <ModernSelect label="Ownership Structure" options={['Private', 'Government', 'Autonomous', 'Deemed']} />
                <ModernField label="Primary Domain" name="emailDomain" placeholder="univ.ac.in" />
              </div>
            </div>
          </section>

          {/* LICENSE SECTION */}
          <section id="product" className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-12">
            <SectionHeader title="License Modules & Logic" icon={<LayoutGrid />} index="02" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {modulesList.map(mod => (
                <button 
                  key={mod} 
                  onClick={() => toggleModule(mod)}
                  className={`p-6 rounded-[24px] border-2 transition-all text-center group ${
                    formData.modules.includes(mod) 
                    ? 'border-blue-600 bg-blue-50/50 shadow-inner' 
                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all shadow-sm ${
                    formData.modules.includes(mod) ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
                  }`}>
                    <Network size={22} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${
                    formData.modules.includes(mod) ? 'text-blue-700' : 'text-slate-500'
                  }`}>{mod}</span>
                </button>
              ))}
            </div>
          </section>

          {/* INFRASTRUCTURE SECTION */}
          <section id="infra" className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-12">
            <SectionHeader title="Cloud Infrastructure Setup" icon={<Cpu />} index="03" />
            <div className="grid md:grid-cols-4 gap-8">
              <ModernSelect label="Connectivity Matrix" options={['Excellent / Fiber', 'Good / Broadband', 'Average', 'Poor']} />
              <ModernSelect label="Deployment Strategy" options={['Cloud Managed', 'On-Premise Hub', 'Hybrid Node']} />
              <ModernField label="Compute Nodes Count" placeholder="No. of Desktop PCs" />
              <ModernSelect label="Default DB Engine" options={['PostgreSQL', 'MongoDB', 'MySQL']} />
            </div>
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}

// --- REUSABLE DESIGN COMPONENTS ---

function SectionHeader({ title, icon, index }) {
  return (
    <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-[18px]">{icon}</div>
        <h3 className="text-xl font-black tracking-tight text-slate-800">{title}</h3>
      </div>
      <span className="text-4xl font-black text-slate-50 select-none italic">#{index}</span>
    </div>
  );
}

function ModernField({ label, ...props }) {
  return (
    <div className="space-y-3 group">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-focus-within:text-blue-600 transition-colors">
        {label}
      </label>
      <input 
        {...props} 
        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none ring-0 focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-200 transition-all placeholder:text-slate-300" 
      />
    </div>
  );
}

function ModernSelect({ label, options }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{label}</label>
      <select className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all cursor-pointer">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MetricRow({ label, value, color }) {
  const dotColors = { blue: 'bg-blue-400', green: 'bg-emerald-400', purple: 'bg-purple-400' };
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500 font-bold tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[color]}`} />
        <span className="font-black text-slate-100">{value}</span>
      </div>
    </div>
  );
}