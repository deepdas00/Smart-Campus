import React, { useState } from 'react';
import { 
  Save, RotateCcw, FileText, ChevronRight, 
  Info, ShieldCheck, Database, History 
} from 'lucide-react';

import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar/Navbar";

export default function ProfessionalAdminPortal() {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const libraryPolicy = [
    { id: "LIB-001", label: "Maximum Books Allowed", value: "05 Units", detail: "Applies to Undergraduate & Postgraduate students", updatedBy: "Admin_Alpha", lastModified: "2024-12-20" },
    { id: "LIB-002", label: "Standard Return Period", value: "14 Days", detail: "Policy excludes gazetted public holidays", updatedBy: "System_Bot", lastModified: "2024-12-15" },
    { id: "LIB-003", label: "Fine Amount (Per Day)", value: "₹10.50", detail: "Automatic calculation via student portal", updatedBy: "Admin_Beta", lastModified: "2024-12-10" },
  ];

  const canteenPolicy = [
    { id: "CAN-001", label: "Kitchen Opening Time", value: "08:30 AM", detail: "Daily breakfast service commencement", updatedBy: "Admin_Alpha", lastModified: "2024-12-20" },
    { id: "CAN-002", label: "Kitchen Closing Time", value: "09:00 PM", detail: "Final order processing deadline", updatedBy: "Admin_Alpha", lastModified: "2024-12-20" },
  ];

  const data = activeTab === 'library' ? libraryPolicy : canteenPolicy;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow w-full max-w-[1800px] mx-auto px-6 py-10">
        
        {/* --- MINIMAL HEADER --- */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Institutional Policy Manager</h1>
            <p className="text-sm text-slate-500 mt-1">Configure global parameters for campus modules.</p>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2"><Database size={14} /> DB: EDU_PROD_01</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} /> Auth: Root_Level</span>
          </div>
        </div>

        {/* --- DATA TAB NAVIGATION --- */}
        <div className="flex border-b border-slate-200 mb-8">
          <button 
            onClick={() => {setActiveTab('library'); setSelectedPolicy(null);}}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'library' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Library Policy
          </button>
          <button 
            onClick={() => {setActiveTab('canteen'); setSelectedPolicy(null);}}
            className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'canteen' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Canteen Policy
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- DATA TABLE (Main Focus) --- */}
          <div className={`${selectedPolicy ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>
            <div className="border border-slate-200 rounded-sm overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">ID</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Policy Parameter</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Current Value</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Last Modified</th>
                    <th className="px-6 py-4 text-right text-[11px] font-black text-slate-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item) => (
                    <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${selectedPolicy?.id === item.id ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-5 text-xs font-mono text-slate-400">{item.id}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono font-bold text-sm bg-slate-100 px-3 py-1 rounded border border-slate-200">
                          {item.value}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-500">
                        {item.lastModified} <br/> <span className="text-[10px] font-bold text-slate-400 uppercase">{item.updatedBy}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setSelectedPolicy(item)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-tighter inline-flex items-center gap-1"
                        >
                          Modify <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- MINIMAL SLIDE-IN EDIT FORM --- */}
          {selectedPolicy && (
            <div className="lg:col-span-4 animate-in slide-in-from-right-4 duration-300">
              <div className="border border-slate-900 p-8 rounded-sm bg-white shadow-xl">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Edit Configuration
                  </h2>
                  <button onClick={() => setSelectedPolicy(null)} className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase">Close</button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Parameter Name</label>
                    <input 
                      type="text" 
                      defaultValue={selectedPolicy.label}
                      className="w-full border border-slate-200 px-4 py-3 text-sm font-bold bg-slate-50 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">System Value</label>
                    <input 
                      type="text" 
                      defaultValue={selectedPolicy.value}
                      className="w-full border border-slate-900 px-4 py-3 text-sm font-bold focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Internal Note</label>
                    <textarea 
                      rows="3"
                      defaultValue={selectedPolicy.detail}
                      className="w-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <button className="w-full bg-slate-900 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Save size={16} /> Confirm & Commit
                    </button>
                    <button onClick={() => setSelectedPolicy(null)} className="w-full bg-white text-slate-500 py-4 text-xs font-bold uppercase tracking-[0.2em] border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <RotateCcw size={16} /> Discard Changes
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex items-start gap-3 p-4 bg-blue-50/50 rounded text-blue-700">
                  <Info size={16} className="mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase leading-relaxed">
                    Changes are recorded in the system audit log with your admin signature.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* --- SYSTEM LOG (Full Width Footer Data) --- */}
        <div className="mt-12 border-t border-slate-200 pt-8">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
             <History size={14} /> Global Change History
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-1 h-10 bg-slate-200 mt-1"></div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase">2 hours ago</p>
                     <p className="text-xs font-bold text-slate-800">Admin_Alpha modified [Fine Amount]</p>
                     <p className="text-[10px] text-slate-500 mt-1 uppercase">Result: Success (200 OK)</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}