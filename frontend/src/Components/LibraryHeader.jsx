import { Search, Library, ShieldCheck } from "lucide-react";

export default function LibraryHeader({ searchQuery, setSearchQuery, children }) {
  return (
    <header className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 sm:px-4 lg:px-0">
  {/* Left Side: Logo & Portal Name */}
  <div className="flex items-center gap-1 sm:gap-4 w-full lg:w-auto">
    <div className="bg-indigo-600 p-3 lg:p-3.5 rounded-2xl shadow-lg shadow-indigo-200 text-white shrink-0">
      <Library size={24} className="lg:w-[28px] lg:h-[28px]" />
    </div>
    <div>
      <h1 className="text-xl lg:text-2xl font-black tracking-tight text-slate-800 leading-none">
        Librarian Portal
      </h1>
      <p className="text-[10px] lg:text-[11px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 mt-1">
        <ShieldCheck size={12} /> Management Active
      </p>
    </div>
  </div>

  {/* Middle Section: Children (Tabs/Status) */}
  {/* On mobile, this will sit between the logo and search bar */}
  <div className="flex justify-center w-full lg:flex-1 order-3 lg:order-2">
    {children}
  </div>

  {/* Right Side: Search Bar */}
  <div className="relative w-full lg:w-96 group order-2 lg:order-3">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
      size={18}
    />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search student or book..."
      className="w-full pl-12 pr-4 py-3 lg:py-3.5 bg-white border-2 border-slate-100 lg:border-transparent rounded-2xl shadow-sm focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-semibold text-sm"
    />
  </div>
</header>
  );
}
