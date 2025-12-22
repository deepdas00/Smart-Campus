import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, GraduationCap, ChevronRight, Plus } from "lucide-react";

export function StudentManager() {
  const [selectedDept, setSelectedDept] = useState("All Departments");

  const departments = ["All Departments", "Computer Science", "Mechanical", "Civil", "Electrical", "MBA"];

  const students = [
    { id: "STU-101", name: "Ananya Sharma", dept: "Computer Science", year: "3rd Year", email: "ananya@univ.edu", status: "Active" },
    { id: "STU-102", name: "Rohan Varma", dept: "Mechanical", year: "2nd Year", email: "rohan@univ.edu", status: "Active" },
    { id: "STU-103", name: "Ishaan Gupta", dept: "Computer Science", year: "4th Year", email: "ishaan@univ.edu", status: "Internship" },
  ];

  const filteredStudents = selectedDept === "All Departments" 
    ? students 
    : students.filter(s => s.dept === selectedDept);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Student Directory</h2>
          <p className="text-gray-500 text-sm">Manage academic profiles and department assignments.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition">
          <Plus size={18} /> Register Student
        </button>
      </div>

      {/* Department Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedDept === dept 
              ? "bg-blue-600 text-white border-blue-600 shadow-md" 
              : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-100 transition-colors" />
            
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl shadow-inner">
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">{student.name}</h4>
                <p className="text-xs text-blue-600 font-bold mt-1">{student.id}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                   <GraduationCap size={12} /> {student.dept}
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-xl font-medium text-gray-600">
                <span>Enrollment Year:</span>
                <span className="text-gray-900 font-bold">{student.year}</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 transition">
                  <Mail size={14} />
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 transition">
                  <Phone size={14} />
                </button>
                <button className="flex-[3] flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider hover:bg-blue-100 transition">
                  View Profile <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}