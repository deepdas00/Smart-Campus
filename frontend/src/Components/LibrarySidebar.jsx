import { LayoutDashboard, BookCopy } from "lucide-react";

export default function LibrarySidebar({
  activeTab,
  setActiveTab,
  setSelectedDept,
  setShowIssueModal,
}) {
  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200/60 font-bold">
        <button
          onClick={() => {
            setActiveTab("transactions");
            setSelectedDept(null);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
            activeTab === "transactions"
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard size={18} /> Active Issues
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
            activeTab === "inventory"
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <BookCopy size={18} /> Book Inventory
        </button>
      </div>

      <button
        onClick={() => setShowIssueModal(true)}
        className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all"
      >
        + Issue New Book
      </button>
    </div>
  );
}
