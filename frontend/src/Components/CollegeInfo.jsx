import { MapPin, Award, Sparkles } from "lucide-react";

export default function CollegeInfo() {
  return (
    <section className="bg-gradient-to-r from-blue-800 via-blue-600 to-sky-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          
          {/* Left Content */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              XYZ Institute of Technology
            </h1>

            <p className="mt-3 text-blue-100 max-w-2xl leading-relaxed">
              Central Digital Library for students and faculty.
              Search, issue, and manage books digitally with real-time availability.
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-5 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-300" />
                Smart Campus Library Block
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-300" />
                NAAC A+ Accredited
              </div>
            </div>
          </div>

          {/* Right Badge */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 flex items-center gap-4 shadow-lg border border-white/20">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-100 uppercase tracking-wide">
                Powered By
              </p>
              <p className="font-semibold text-white">
                Smart Campus Digital System
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
