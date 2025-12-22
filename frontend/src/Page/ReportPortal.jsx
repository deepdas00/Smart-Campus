import React, { useState, useEffect } from 'react';
import { 
  Building2, FlaskConical, Home, Trees, ShieldAlert, 
  CheckCircle2, ChevronRight, Info, Sparkles, Loader2,
  FileText, MapPin, Clock, ArrowLeft, SendHorizontal
} from 'lucide-react';

export default function EduReportPortal() {
  const [sector, setSector] = useState('Academic');
  const [urgency, setUrgency] = useState('Standard');
  const [step, setStep] = useState(1); // 1: Info, 2: Details, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", building: "", room: "",
    zone: "", labId: "", floor: "", wing: ""
  });

  // --- CONFIGURATION ---
  const sectors = {
    Academic: { 
      icon: <FlaskConical size={18}/>, 
      label: "Research & Labs",
      fields: ['building', 'room', 'labId'],
      desc: "Issues in classrooms, lecture halls, or research facilities."
    },
    Residential: { 
      icon: <Home size={18}/>, 
      label: "Housing & Dorms",
      fields: ['building', 'wing', 'floor', 'room'],
      desc: "Maintenance for student housing and residential complexes."
    },
    Campus: { 
      icon: <Trees size={18}/>, 
      label: "Grounds & Public",
      fields: ['zone', 'building'],
      desc: "Report issues in parking, parks, or campus walkways."
    }
  };

  const zones = ["North Quad", "South Plaza", "Sports Complex", "Library Walk"];

  // --- THEME ENGINE ---
  const getTheme = () => {
    const themes = {
      Standard: "bg-slate-50 border-slate-200 text-blue-700 accent-blue-600",
      Medium: "bg-amber-50 border-amber-200 text-amber-700 accent-amber-600",
      Urgent: "bg-red-50 border-red-200 text-red-700 accent-red-600"
    };
    return themes[urgency];
  };

  const handleInputChange = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Professional Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 uppercase">Insti<span className="text-blue-600">Fix</span></h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Official Support Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Operations Center Online
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        {step < 3 && (
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</div>
              <div className={`h-px w-12 bg-slate-200`} />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</div>
            </div>
            <button 
              onClick={() => setUrgency(urgency === 'Standard' ? 'Medium' : urgency === 'Medium' ? 'Urgent' : 'Standard')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${getTheme()}`}
            >
              Priority: {urgency}
            </button>
          </div>
        )}

        {step === 1 && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center max-w-lg mx-auto mb-12">
              <h2 className="text-3xl font-bold text-slate-800">What can we help with?</h2>
              <p className="text-slate-500 mt-2">Select the appropriate department to route your request to the right team.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(sectors).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {setSector(key); setStep(2);}}
                  className={`p-6 rounded-2xl border text-left transition-all hover:shadow-xl group ${sector === key ? 'border-blue-600 bg-white ring-4 ring-blue-50' : 'bg-white border-slate-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-colors ${sector === key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-slate-800">{value.label}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{value.desc}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-blue-600">
                  <FileText size={18} />
                  <h3 className="font-bold uppercase text-xs tracking-widest">Issue Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Report Title</label>
                    <input 
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 ring-blue-500/20 outline-none transition-all"
                      placeholder="Brief headline (e.g. AC leaking)"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {sectors[sector].fields.map(field => (
                      <div key={field}>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">{field.replace('Id', ' ID')}</label>
                        {field === 'zone' ? (
                          <select 
                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none"
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          >
                            <option value="">Select Zone</option>
                            {zones.map(z => <option key={z} value={z}>{z}</option>)}
                          </select>
                        ) : (
                          <input 
                            className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none"
                            placeholder={field}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Description</label>
                    <textarea 
                      rows="4"
                      className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none"
                      placeholder="Provide specific details to help our team..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-900 p-8 rounded-3xl text-white shadow-lg">
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Request Summary</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-70">Sector</span>
                    <span className="font-bold">{sector}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="opacity-70">Priority</span>
                    <span className="font-bold text-amber-400">{urgency}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                    <Info size={14} />
                    <span className="text-[10px] leading-tight">Requests are routed to campus security if marked Urgent.</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><SendHorizontal size={20}/> Submit Report</>}
              </button>
              <button onClick={() => setStep(1)} className="w-full text-slate-400 text-xs font-bold uppercase hover:text-slate-600 transition-colors">
                Go Back
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="text-center py-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-bold text-slate-800 italic uppercase">Report Logged</h2>
            <p className="text-slate-500 max-w-sm mx-auto mt-4">
              Your request for <strong>{formData.title || "Facility Issue"}</strong> has been assigned Ticket #EDU-2025-{Math.floor(Math.random()*9000)}.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <button onClick={() => {setStep(1); setFormData({});}} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-sm">New Request</button>
              <button className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-bold text-sm">View Status</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}