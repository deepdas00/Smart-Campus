import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Clock,
  Search,
  AlertCircle,
  Users,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export function LibraryManager() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("transactions");
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setLoadingBooks(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/library/transactions`,
          { withCredentials: true }
        );

        setTransactions(res.data.data || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
        setLoadingBooks(false);
      }
    };
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoadingBooks(true);
      setLoadingBooks(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/library/books`,
        { withCredentials: true }
      );

      console.log("BOOKS AYA", res.data.data);

      setBooks(res.data.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoadingBooks(false);
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "books") return;

    fetchBooks();
  }, [activeTab]);

  useEffect(() => {
    fetchBooks();
  }, []);

  //Loader

  // Buffering Shimmer Loader
  const TableLoader = ({ cols = 6 }) => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="bg-white">
          {[...Array(cols)].map((__, j) => (
            <td key={j} className="px-6 py-4">
              <div className="relative overflow-hidden h-4 bg-gray-100 rounded-lg">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-200/50 to-transparent"></div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  const query = searchQuery.trim().toLowerCase();

  // Filter transactions based on search
  const filteredTransactions = transactions.filter((tx) => {
    if (!query) return true;

    return (
      tx.transactionCode?.toLowerCase().includes(query) ||
      tx.studentId?.studentName?.toLowerCase().includes(query) ||
      tx.studentId?.rollNo?.toLowerCase().includes(query) ||
      tx.bookId?.isbn?.toLowerCase().includes(query) ||
      tx.bookId?.isbn?.toLowerCase().includes(query)
    );
  });

  const filteredBooks = books.filter((book) => {
    if (!query) return true;

    return (
      book.isbn?.toLowerCase().includes(query) ||
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query) // 👈 department
    );
  });

  // ================= STATS CALCULATION =================

  // ---- Transactions ----
  const totalTransactions = transactions.length;

  const activeIssues = transactions.filter(
    (tx) => tx.transactionStatus === "issued"
  ).length;

  const pendingFines = transactions.filter(
    (tx) => tx.paymentStatus === "pending" && (tx.fineAmount || 0) > 0
  ).length;

  const totalFineCollected = transactions
    .filter((tx) => tx.paymentStatus === "paid")
    .reduce((sum, tx) => sum + (tx.fineAmount || 0), 0);

  // ---- Books ----
  const totalBooks = books.length;

  const totalCopies = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0);

  const availableCopies = books.reduce(
    (sum, b) => sum + (b.availableCopies || 0),
    0
  );

  const issuedCopies = totalCopies - availableCopies;

  const lowStockBooks = books.filter((b) => b.availableCopies <= 3).length;

  // --- DYNAMIC STATS CARDS ---
  const statCards = [
    {
      title: "Total Books",
      value: totalBooks || 0,
      sub: "Titles in Catalogue",
      icon: BookOpen,
      color: "indigo",
    },
    {
      title: "Available Copies",
      value: availableCopies || 0,
      sub: "Ready to issue",
      icon: Users,
      color: "green",
    },
    {
      title: "Active Issues",
      value: activeIssues || 0,
      sub: "Currently out",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Pending Fines",
      value: pendingFines || 0,
      sub: "Need attention",
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Library Authority
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Monitoring circulation and study space capacity.
          </p>
        </div>
      </div>

      {/* --- COMPACT STATS & ANALYTICS --- */}
      {/* --- COMPACT STATS & ANALYTICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Side: Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-r from-white/80 to-gray-50 border border-gray-100 rounded-2xl p-3 shadow-md hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] font-bold uppercase text-gray-400">
                    {stat.title}
                  </p>
                  <span
                    className={`p-1 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}
                  >
                    <Icon size={14} />
                  </span>
                </div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">
                  {stat.value}
                </p>
                <p className="text-[9px] text-gray-500 mt-1">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Mini Graphs */}
        {/* Right Side: Mini Graphs */}
<div className="space-y-2">

  {/* Most Popular Books by Issues */}
  {books.length > 0 && (
    <div className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition">
      <h4 className="text-[9px] font-bold text-gray-400 uppercase mb-1">
        Most Popular Books (by Issues)
      </h4>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart
          data={books
            .map((b) => ({
              title: b.title,
              issued: (b.totalCopies || 0) - (b.availableCopies || 0),
            }))
            .sort((a, b) => b.issued - a.issued)
            .slice(0, 8)}
        >
          <XAxis dataKey="title" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`${value} issued`, "Issued"]}
          />
          <Bar dataKey="issued" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}

  {/* Transactions Status Pie */}
  {transactions.length > 0 && (
    <div className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition">
      <h4 className="text-[9px] font-bold text-gray-400 uppercase mb-1">
        Transactions Status
      </h4>
      <ResponsiveContainer width="100%" height={80}>
        <PieChart>
          <Pie
            data={[
              { name: "Issued", value: activeIssues },
              { name: "Returned", value: totalTransactions - activeIssues },
            ]}
            dataKey="value"
            nameKey="name"
            innerRadius={20}
            outerRadius={40}
            paddingAngle={3}
          >
            <Cell key="issued" fill="#facc15" />
            <Cell key="returned" fill="#22c55e" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}

  {/* Low Stock Books */}
  {lowStockBooks > 0 && (
    <div className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition">
      <h4 className="text-[9px] font-bold text-gray-400 uppercase mb-1">
        Low Stock Books
      </h4>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart
          data={books.filter((b) => b.availableCopies <= 3).slice(0, 8)}
        >
          <XAxis dataKey="title" hide />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="availableCopies" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )}

</div>

      </div>

      {/* --- MIDDLE SECTION: TWO COLUMN --- */}
      <div className="grid grid-cols-1 gap-8">
        {/* Circulation Feed */}
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex gap-52 items-center">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition
      ${
        activeTab === "transactions"
          ? "bg-white text-gray-900 shadow"
          : "text-gray-500 hover:text-gray-900 hover:bg-white"
      }`}
              >
                Transactions
              </button>

              <button
                onClick={() => setActiveTab("books")}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition
      ${
        activeTab === "books"
          ? "bg-white text-gray-900 shadow"
          : "text-gray-500 hover:text-gray-900 hover:bg-white"
      }`}
              >
                Books
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "transactions"
                      ? "Search Transaction, Roll No, Student, ISBN..."
                      : "Search Book, Author, ISBN, Department..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-11 pr-10 py-2.5 text-sm font-medium
               rounded-xl border border-gray-200 bg-white
               placeholder:text-gray-400
               shadow-sm
               transition-all
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               hover:border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Transactions Table */}

          {activeTab === "transactions" && (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Student Info
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Book Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Fine
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <TableLoader cols={6} />
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400"
                      >
                        No matching transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className={`transition-colors ${
                          tx.paymentStatus === "pending"
                            ? "bg-red-300/20 hover:bg-red-400/40"
                            : "hover:bg-blue-50/30"
                        }`}
                      >
                        {/* Transaction Code & Time */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            #{tx.transactionCode}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString()} ·{" "}
                            {new Date(tx.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Student Info */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-800">
                            {tx.studentId.studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tx.studentId.rollNo}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {tx.studentId.email}
                          </div>
                        </td>

                        {/* Book Details */}
                        <td className="px-6 py-4">
                          <div className="max-w-[220px]">
                            <div className="text-sm font-semibold text-gray-700 truncate">
                              {tx.bookId.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tx.bookId.author}
                            </div>
                          </div>
                        </td>

                        {/* Fine Amount */}
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            ₹{tx.fineAmount || 0}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              tx.paymentStatus === "paid"
                                ? "bg-green-100 text-green-600"
                                : tx.paymentStatus === "pending"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tx.paymentStatus}
                          </span>
                        </td>

                        {/* Transaction Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              tx.transactionStatus === "returned"
                                ? "bg-green-100 text-green-700"
                                : tx.transactionStatus === "issued"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
                            {tx.transactionStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              👁
                            </button>
                            <button className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800">
                              Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "books" && (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Book
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Copies
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Utilization
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Shelf
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loadingBooks ? (
                    <TableLoader cols={8} />
                  ) : filteredBooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-10 text-gray-400"
                      >
                        No matching books found
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => {
                      const issued = book.totalCopies - book.availableCopies;
                      const utilization =
                        book.totalCopies > 0
                          ? Math.round((issued / book.totalCopies) * 100)
                          : 0;

                      return (
                        <tr key={book._id} className="hover:bg-gray-50">
                          {/* Book */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 max-w-[320px]">
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-10 h-14 rounded border object-cover"
                              />
                              <div>
                                <div className="font-semibold text-gray-900 leading-tight">
                                  {book.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {book.author} • {book.publishedYear}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  ISBN: {book.isbn}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {book.category}
                          </td>

                          {/* Copies */}
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            <span className="text-gray-900 font-semibold">
                              {book.totalCopies}
                            </span>{" "}
                            /{" "}
                            <span
                              className={
                                book.availableCopies < 5
                                  ? "text-red-600 font-bold"
                                  : "text-green-600 font-bold"
                              }
                            >
                              {book.availableCopies}
                            </span>
                            <div className="text-[10px] text-gray-400">
                              Issued: {issued}
                            </div>
                          </td>

                          {/* Utilization */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    utilization > 80
                                      ? "bg-red-500"
                                      : utilization > 50
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${utilization}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-700">
                                {utilization}%
                              </span>
                            </div>
                          </td>

                          {/* Shelf */}
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {book.shelf || "—"}
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            ⭐ {Number(book.rating).toFixed(1)}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded-full ${
                                book.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {book.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <button className="px-3 py-1 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
