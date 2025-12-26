import { LayoutDashboard, BookCopy } from "lucide-react";

export default function LibrarySidebar({
  activeTab,
  setActiveTab,
  setSelectedDept,
}) {
  return (
    <aside className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 space-y-3">
      

      <button
        onClick={() => {
          setActiveTab("transactions");
          setSelectedDept(null);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
          activeTab === "transactions"
            ? "bg-indigo-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <LayoutDashboard size={18} />
        Active Issues
      </button>

      <button
        onClick={() => setActiveTab("inventory")}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
          activeTab === "inventory"
            ? "bg-indigo-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <BookCopy size={18} />
        Book Inventory
      </button>
    </aside>
  );
}
