import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, Filter, 
  Search, MoreVertical, MessageSquare, MapPin 
} from "lucide-react";

export function CampusIssues() {
  const [filter, setFilter] = useState('All');

  const issues = [
    { 
      id: "ISS-2401", 
      title: "Broken AC - Room 302", 
      status: "In Progress", 
      priority: "High", 
      user: "Rahul S.", 
      aiTag: "HVAC", 
      location: "Admin Block",
      time: "2h ago",
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecb?auto=format&fit=crop&w=100&q=80" 
    },
    { 
      id: "ISS-2402", 
      title: "Water Leakage - Block A", 
      status: "Reported", 
      priority: "Critical", 
      user: "Priya K.", 
      aiTag: "Plumbing", 
      location: "Girls Hostel",
      time: "15m ago",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=100&q=80"
    },
    { 
      id: "ISS-2403", 
      title: "Flickering Lights - Library", 
      status: "Fixed", 
      priority: "Low", 
      user: "Amit V.", 
      aiTag: "Electrical", 
      location: "Central Library",
      time: "5h ago",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=100&q=80"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Maintenance Pipeline</h2>
          <p className="text-gray-500 text-sm">Review and manage AI-categorized campus infrastructure reports.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search issues..." className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <button className="p-2 border rounded-xl hover:bg-gray-50"><Filter className="w-5 h-5 text-gray-600" /></button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-gray-200 gap-8">
        {['All', 'Reported', 'In Progress', 'Fixed'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-4 text-sm font-semibold transition-all relative ${filter === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {filter === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="grid gap-4">
        {issues.filter(i => filter === 'All' || i.status === filter).map((issue) => (
          <div key={issue.id} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              
              {/* Issue Image (AI Input) */}
              <div className="w-full lg:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                <img src={issue.image} alt="issue" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {issue.id}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-gray-900 text-lg">{issue.title}</h4>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500" /> {issue.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {issue.time}</span>
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                    AI: {issue.aiTag}
                  </span>
                </div>

                <p className="text-xs text-gray-400">Reported by <span className="text-gray-700 font-medium">{issue.user}</span></p>
              </div>

              {/* Action Area */}
              <div className="flex items-center gap-3 border-t lg:border-t-0 pt-4 lg:pt-0">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition">
                  <MessageSquare className="w-4 h-4" /> Chat
                </button>
                <div className="h-8 w-[1px] bg-gray-200 hidden lg:block" />
                <select className={`text-sm font-bold p-2 pr-8 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer
                  ${issue.status === 'Fixed' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
                  <option>Reported</option>
                  <option>In Progress</option>
                  <option>Fixed</option>
                </select>
                <button className="p-2 hover:bg-gray-100 rounded-full transition"><MoreVertical className="w-5 h-5 text-gray-400" /></button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3 text-blue-800 border border-blue-100">
        <AlertCircle className="w-5 h-5" />
        <p className="text-sm font-medium">
          <span className="font-bold">AI Note:</span> 85% of issues this week are categorized under "Infrastructure". Consider scheduling a general campus audit.
        </p>
      </div>
    </div>
  );
}