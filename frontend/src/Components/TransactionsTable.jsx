import { CheckCircle, Calendar, Hash, BookOpen } from "lucide-react";

export default function TransactionsTable({
  transactions,
  setShowReturnConfirm,
}) {
  return (
    <div className="px-2 lg:px-6 pb-6 w-full">
      {/* --- LAPTOP UI (UNCANGED) --- */}
      <div className="hidden lg:block overflow-x-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <th className="px-6 py-4 text-left">Borrower</th>
              <th className="px-6 py-4 text-center">Asset</th>
              <th className="px-6 py-4 text-center">Timeline</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 pl-10 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-indigo-50/30">
                <td className="px-4 py-3 text-left bg-white rounded-l-2xl shadow-sm">
                  <p className="font-bold">{tx.student}</p>
                  <p className="text-[10px] text-slate-400">#{tx.roll}</p>
                </td>

                <td className="px-6 py-5 bg-white shadow-sm">
                  <div className="flex items-left justify-start gap-3">
                    {tx.coverImage ? (
                      <img
                        src={tx.coverImage}
                        alt={tx.book}
                        className="w-10 h-14 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-slate-100 rounded-md" />
                    )}
                    <span className="font-semibold">{tx.book}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center bg-white shadow-sm">{tx.date}</td>
                <td className="px-6 py-5 text-center bg-white shadow-sm">
                  <h4
                    className={`inline-block px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider
                      ${
                        tx.status === "overdue"
                          ? "bg-red-100 text-red-600"
                          : tx.status === "issued"
                          ? "bg-emerald-100 text-emerald-600"
                          : tx.status === "returned"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {tx.status}
                  </h4>
                </td>

                <td className="px-6 py-5 text-right bg-white rounded-r-2xl shadow-sm">
                  <button
                    onClick={() =>
                      setShowReturnConfirm({
                        id: tx.id,
                        student: tx.student,
                        bookTitle: tx.book,
                      })
                    }
                    className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white px-4 py-2 rounded-xl text-[12px] flex justify-center gap-2 hover:bg-blue-600 transition-all"
                  >
                    <CheckCircle size={16} /> Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE UI (RESPONSIVE - ALL DATA PRESERVED) --- */}
      <div className="lg:hidden flex flex-col gap-2 mt-2">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-[1rem] p-3 border border-slate-100 shadow-sm">
            {/* 1. Borrower Info */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <Hash size={16} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm leading-tight">{tx.student}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Roll: #{tx.roll}</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                tx.status === "overdue" ? "bg-red-500 text-white" : 
                tx.status === "issued" ? "bg-emerald-500 text-white" :
                tx.status === 'returned' ? "bg-blue-500 text-white" : "bg-slate-400 text-white"
              }`}>
                {tx.status}
              </span>
            </div>

            {/* 2. Asset Details (Image + Book Title) */}
            <div className="flex items-center gap-2 bg-slate-50/80 p-1 rounded-2xl mb-4 border border-slate-100">
              <div className="shrink-0 shadow-md">
                {tx.coverImage ? (
                  <img src={tx.coverImage} alt={tx.book} className="w-12 h-16 object-cover rounded-lg border-2 border-white" />
                ) : (
                  <div className="w-12 h-16 bg-slate-200 rounded-lg flex items-center justify-center"><BookOpen size={16}/></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Asset Name</p>
                <p className="font-bold text-slate-700 leading-tight">{tx.book}</p>
              </div>
            </div>

            {/* 3. Timeline & Action */}
            <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
               <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Return Date</p>
                  <div className="flex items-center gap-1 text-slate-600 mt-1">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">{tx.date}</span>
                  </div>
               </div>
               
               <button
                  onClick={() => setShowReturnConfirm({ id: tx.id, student: tx.student, bookTitle: tx.book })}
                  className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-slate-200"
                >
                  <CheckCircle size={13} /> Return
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}