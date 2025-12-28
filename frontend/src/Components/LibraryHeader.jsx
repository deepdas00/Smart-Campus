import { Search, Library, ShieldCheck } from "lucide-react";

export default function LibraryHeader({ searchQuery, setSearchQuery, children }) {
  return (
    <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-5">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-600 p-3.5 rounded-2xl shadow-lg shadow-indigo-200 text-white">
          <Library size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">
            Librarian Portal
          </h1>
          <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={12} /> Management Active
          </p>
        </div>
      </div>


      <div className="flex flex-1 justify-center">
        {children}
      </div>


      

      <div className="relative w-full md:w-96 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student or book..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-indigo-500/20 outline-none transition-all font-semibold text-sm"
        />
      </div>
    </header>
  );
}
