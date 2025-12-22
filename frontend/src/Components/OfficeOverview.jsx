import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  Users, AlertTriangle, CheckCircle, IndianRupee, 
  ArrowUpRight, TrendingUp, Calendar, Clock 
} from "lucide-react";

// Mock Data for Graphs
const issueData = [
  { name: 'Mon', issues: 40 },
  { name: 'Tue', issues: 30 },
  { name: 'Wed', issues: 65 },
  { name: 'Thu', issues: 45 },
  { name: 'Fri', issues: 90 },
  { name: 'Sat', issues: 20 },
  { name: 'Sun', issues: 15 },
];

const revenueData = [
  { name: '10am', sales: 1200 },
  { name: '12pm', sales: 4500 },
  { name: '2pm', sales: 3800 },
  { name: '4pm', sales: 2100 },
];

export function OfficeOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Command Center</h1>
          <p className="text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Today is {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm">Export PDF</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-md">Refresh Data</button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" value="₹1,24,500" change="+14%" icon={<IndianRupee />} color="text-green-600" bg="bg-green-50" />
        <StatCard label="Reported Issues" value="42" change="+5 today" icon={<AlertTriangle />} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Avg. Resolve Time" value="1.8 Days" change="-12%" icon={<Clock />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Library Attendance" value="842" change="92% capacity" icon={<Users />} color="text-purple-600" bg="bg-purple-50" />
      </div>

      {/* --- GRAPHS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issue Trends Graph */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Weekly Issue Trends</h3>
            <select className="text-sm border-none bg-gray-50 rounded-md p-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Canteen Hourly Sales */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" /> Hourly Canteen Revenue
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: Recent Activity & Staff Status --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Critical Maintenance Updates</h3>
            <button className="text-blue-600 text-sm font-semibold">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            <ActivityItem title="Main Gate Camera Offline" time="2 mins ago" status="Critical" color="text-red-600" />
            <ActivityItem title="Library AC Repair Scheduled" time="45 mins ago" status="Pending" color="text-orange-600" />
            <ActivityItem title="Cafeteria Water Filter Replaced" time="3 hours ago" status="Completed" color="text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="font-bold mb-4 flex items-center gap-2">AI Campus Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Infrastructure Health</span>
                <span>88%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-full rounded-full w-[88%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Student Satisfaction</span>
                <span>94%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-full rounded-full w-[94%]"></div>
              </div>
            </div>
            <p className="text-xs opacity-70 mt-4 leading-relaxed">
              *AI analysis suggests increasing canteen staff between 12 PM - 1 PM to reduce wait times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, change, icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {change}
        </span>
      </div>
      <div className="mt-4">
        <h4 className="text-gray-500 text-sm font-medium">{label}</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, status, color }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')}`}></div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>
      <span className={`text-xs font-bold ${color}`}>{status}</span>
    </div>
  );
}