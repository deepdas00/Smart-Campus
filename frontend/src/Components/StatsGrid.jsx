import {
  CheckSquare,
  BookMarked,
  AlertCircle,
  Library,
} from "lucide-react";

export default function StatsGrid({ stats }) {
  const data = [
    {
      label: "Available",
      val: stats.totalBooksInLibrary,
      icon: CheckSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Issued",
      val: stats.activeIssues,
      icon: BookMarked,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Overdue",
      val: stats.overdueCount,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Unique Titles",
      val: stats.totalTitles,
      icon: Library,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-6 w-full">
  {data.map((stat, i) => (
    <div
      key={i}
      className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/60 flex justify-center items-center flex-col"
    >
      <div
        className={`${stat.bg} ${stat.color} w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3`}
      >
        <stat.icon size={18} className="sm:hidden" />
        <stat.icon size={20} className="hidden sm:block" />
      </div>

      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {stat.label}
      </p>

      <h3 className="text-xl sm:text-2xl font-black text-slate-800">
        {stat.val}
      </h3>
    </div>
  ))}
</div>

  );
}
