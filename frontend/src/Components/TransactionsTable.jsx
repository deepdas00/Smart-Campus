import { CheckCircle } from "lucide-react";

export default function TransactionsTable({
  transactions,
  setShowReturnConfirm,
}) {


  console.log("HUYAAAAA",transactions);
  
  return (
    <div className="px-6 pb-6 overflow-x-auto w-full">
      <table className="w-full border-separate border-spacing-y-3">
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
              <td className="px-6 py-5 text-left">
                <p className="font-bold">{tx.student}</p>
                <p className="text-[10px] text-slate-400">#{tx.roll}</p>
              </td>
              
              <td className="flex items-center text-center gap-3">
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
    </td>
              <td className="px-6 py-5 text-center">{tx.date}</td>
              <td className="px-6 py-5 text-center">
  <h4
    className={`inline-block px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider
      ${
        tx.status === "overdue"
          ? "bg-red-100 text-red-600"
          : tx.status === "issued"
          ? "bg-emerald-100 text-emerald-600"
          :tx.status === 'returned'?
          "bg-blue-100 text-blue-600"
          : "bg-slate-100 text-slate-500"
      }`}
  >
    {tx.status}
  </h4>
</td>

              <td className="px-6 py-5 t text-right">
                <button
                  onClick={() =>
                    setShowReturnConfirm({
                      id: tx.id,
                      student: tx.student,
                      bookTitle: tx.book,
                    })
                  }
                  className="opacity-0 group-hover:opacity-100 bg-slate-900 text-white px-4 py-2 rounded-xl text-[12px] flex justify-center gap-2 hover:bg-blue-600"
                >
                  <CheckCircle size={16} /> Return
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
