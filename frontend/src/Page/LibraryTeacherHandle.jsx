import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import {
  Search,
  Plus,
  BookOpen,
  Upload,
  CheckCircle,
  X,
  Library,
  ShieldCheck,
  LayoutDashboard,
  BookCopy,
  AlertCircle,
  CheckSquare,
  AlertTriangle,
  Folder,
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  BookMarked,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
import CollegeInfo from "../Components/CollegeInfo";
import LibraryHeader from "../Components/LibraryHeader";
import LibrarySidebar from "../Components/LibrarySidebar";
import StatsGrid from "../Components/StatsGrid";
import TransactionsTable from "../Components/TransactionsTable";

export default function LibraryTeacherHandle() {
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isUpdatingBook, setIsUpdatingBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const isEditMode = Boolean(editingBook);

  const [isDeletingBook, setIsDeletingBook] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // --- STATE SECTIONS ---
  const [activeTab, setActiveTab] = useState("transactions");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  // Track book being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [showReturnConfirm, setShowReturnConfirm] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [visibleTransactions, setVisibleTransactions] = useState(5); // initially show 5

  const initialBookState = {
  title: "",
  author: "",
  category: "",
  rating: "",
  totalCopies: "",
  availableCopies: "",
  shelf: "",
  isbn: "",
  publisher: "",
  publishedYear: "",
  description: "",
  coverImage: null,
};


 const [newBook, setNewBook] = useState(initialBookState);


  const [newIssue, setNewIssue] = useState({
    student: "",
    roll: "",
    bookTitleId: "",
    specificBookId: "",
  });

  const [books, setBooks] = useState([]);

  const [loadingBooks, setLoadingBooks] = useState(true);
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingBooks(true);
        const token = Cookies.get("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/library/books`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("All BOOKS AREREEEEE", res.data);

        setBooks(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transactionError, setTransactionError] = useState(null);

  const normalizeTransaction = (tx) => ({
    id: tx._id,
    student: tx.studentId?.studentName || "Unknown",
    roll: tx.studentId?.rollNo || "-",

    book: tx.bookId?.title || "Unknown",
    coverImage: tx.bookId?.coverImage || null, // ✅ ADD THIS
    author: tx.bookId?.author || "", // optional

    date: new Date(tx.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    status: tx.transactionStatus,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoadingTransactions(true);

        const token = Cookies.get("accessToken");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/library/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log("THE RESPONSEEEEEEEE", res);

        const normalized = res.data.data.map(normalizeTransaction);

        setTransactions(normalized);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
        setTransactionError("Unable to load transactions");
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  // Derived departments
  const departments = [...new Set(books.map((b) => b.category))];

  // --- LOGIC SECTION ---
  const stats = {
    totalBooksInLibrary: books.reduce(
      (acc, book) => acc + (book.stock ?? book.availableCopies ?? 0),
      0
    ),

    activeIssues: transactions.length,
    overdueCount: transactions.filter((t) => t.status === "overdue").length,
    totalTitles: books.length,
  };

  const handleIssueBook = () => {
    if (
      !newIssue.student ||
      !newIssue.bookTitleId ||
      !newIssue.roll ||
      !newIssue.specificBookId
    ) {
      alert("Please fill all fields.");
      return;
    }
    const selectedBookType = books.find((b) => b.id === newIssue.bookTitleId);
    const newEntry = {
      id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
      student: newIssue.student,
      roll: newIssue.roll,
      book: selectedBookType.title,
      specificId: newIssue.specificBookId.toUpperCase(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      status: "issued",
    };
    setTransactions([newEntry, ...transactions]);
    setBooks(
      books.map((b) =>
        b.id === selectedBookType.id ? { ...b, stock: b.stock - 1 } : b
      )
    );
    setShowIssueModal(false);
    setNewIssue({ student: "", roll: "", bookTitleId: "", specificBookId: "" });
  };

  const handleAddBook = async () => {
    try {
      if (
        !newBook.title ||
        !newBook.author ||
        !newBook.category ||
        !newBook.totalCopies ||
        !newBook.shelf ||
        !newBook.coverImage
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      setIsAddingBook(true);

      const token = Cookies.get("accessToken");

      const formData = new FormData();
      Object.entries(newBook).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/library/books`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // update UI instantly
      setBooks((prev) => [res.data.data, ...prev]);

      setShowAddBookModal(false);
      setNewBook({
        title: "",
        author: "",
        category: "",
        rating: "",
        totalCopies: "",
        availableCopies: "",
        shelf: "",
        isbn: "",
        publisher: "",
        publishedYear: "",
        description: "",
        coverImage: null,
      });

      toast.success("Book added successfully!"); // <-- Success toast
      setShowAddBookModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add book");
    } finally {
      setIsAddingBook(false);
    }
  };

  const handleUpdateBook = async () => {
    try {
      if (!newBook.title || !newBook.author || !newBook.category) {
        toast.error("Required fields cannot be empty");
        return;
      }

      setIsUpdatingBook(true);

      const token = Cookies.get("accessToken");
      console.log("newwwwwBook", newBook);
      

      const payload = {
        title: newBook.title,
        author: newBook.author,
        category: newBook.category,
        totalCopies: Number(newBook.totalCopies),
        availableCopies: Number(newBook.availableCopies),
        shelf: newBook.shelf,
        rating: Number(newBook.rating),
        isbn: newBook.isbn,
        publisher: newBook.publisher,
        publishedYear: Number(newBook.publishedYear),
        description: newBook.description,
        coverImage : newBook.coverImage,
      };

      console.log("PAYLOADDD", payload);
      

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/library/books/${
          editingBook._id
        }`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Updated:", res.data);

      // 🔥 Update UI instantly
      setBooks((prev) =>
        prev.map((b) => (b._id === editingBook._id ? res.data.data : b))
      );

      toast.success("Book updated successfully");
      setShowAddBookModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update book");
    } finally {
      setIsUpdatingBook(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setIsDeletingBook(true);

      const token = Cookies.get("accessToken");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/library/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // 🔥 Remove book instantly from UI
      setBooks((prev) => prev.filter((b) => b._id !== bookId));

      toast.success("Book deleted successfully");
      setBookToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete book");
    } finally {
      setIsDeletingBook(false);
    }
  };

  const confirmReturn = () => {
    if (!showReturnConfirm) return;
    const { id, bookTitle } = showReturnConfirm;
    setTransactions(transactions.filter((t) => t.id !== id));
    setBooks(
      books.map((b) =>
        b.title === bookTitle ? { ...b, stock: b.stock + 1 } : b
      )
    );
    setShowReturnConfirm(null);
  };

  // --- SEARCH FILTER LOGIC ---

  // 1. Filter Transactions (Active Issues)
  const filteredTransactions =
    activeTab === "transactions"
      ? transactions.filter((tx) => {
          const query = searchQuery?.toLowerCase() || "";
          return (
            tx?.student?.toLowerCase().includes(query) ||
            tx?.book?.toLowerCase().includes(query) ||
            tx?.roll?.toLowerCase().includes(query)
          );
        })
      : transactions;

  // 2. Filter Books (Inventory)
  const filteredBooks =
    activeTab === "inventory"
      ? books.filter((book) => {
          const query = searchQuery?.toLowerCase() || "";
          return (
            book?.title?.toLowerCase().includes(query) ||
            book?.author?.toLowerCase().includes(query) ||
            book?.category?.toLowerCase().includes(query)
          );
        })
      : books;


const handleCloseModal = () => {
  setShowAddBookModal(false); // Close modal
  setNewBook(initialBookState); // Reset all fields
  setEditingBook(null); // Reset edit mode
};

  return (
    <>
      <Navbar />
      <div className="">
        <CollegeInfo />
        <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans text-slate-900 ">
          {/* --- TOP NAVIGATION BAR --- */}
          <LibraryHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="max-w-full mx-auto flex gap- flex-col">
            {/* --- LEFT SIDEBAR --- */}
            <div className="w-full flex gap-8 items-start">
              {/* Sidebar */}
              <div className="w-64 shrink-0">
                <LibrarySidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setSelectedDept={setSelectedDept}
                  setShowIssueModal={setShowIssueModal}
                />
              </div>

              {/* Stats */}
              <div className="flex-1">
                <StatsGrid stats={stats} />
              </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="lg:col-span-9 space-y-6 mt-6">
              {/* STATS SECTION */}

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden min-h-[400px]">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center  bg-blue-200 ">
                  <div className="flex items-center gap-2 ">
                    {selectedDept && (
                      <ArrowLeft
                        size={20}
                        className="cursor-pointer text-slate-400 mr-2"
                        onClick={() => setSelectedDept(null)}
                      />
                    )}
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">
                      {activeTab === "transactions"
                        ? "Active Borrowers"
                        : selectedDept
                        ? `Inventory / ${selectedDept}`
                        : "Department Folders"}
                    </h3>
                  </div>
                  {activeTab === "inventory" && !selectedDept && (
                    <button
                      onClick={() => setShowAddBookModal(true)}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                    >
                      <Plus size={14} /> Add New Book
                    </button>
                  )}
                </div>

                {activeTab === "transactions" ? (
                  loadingTransactions ? (
                    <div className="p-12 text-center font-bold text-slate-400">
                      Loading transactions...
                    </div>
                  ) : transactionError ? (
                    <div className="p-12 text-center text-red-500 font-bold">
                      {transactionError}
                    </div>
                  ) : (
                    <>
                      <TransactionsTable
                        transactions={filteredTransactions.slice(
                          0,
                          visibleTransactions
                        )}
                        setShowReturnConfirm={setShowReturnConfirm}
                      />

                      {visibleTransactions < filteredTransactions.length && (
                        <div className="flex justify-center mb-4">
                          <button
                            onClick={() =>
                              setVisibleTransactions((prev) => prev + 5)
                            }
                            className="group flex items-center gap-2 px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm transition-all duration-200 active:scale-95"
                          >
                            <span>View More Transactions</span>
                            <svg
                              className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </>
                  )
                ) : (
                  <div className="p-8">
                    {!selectedDept ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept) => (
                          <div
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className="group p-6 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-indigo-500 transition-all cursor-pointer"
                          >
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Folder size={24} />
                            </div>
                            <h4 className="font-black text-slate-800 text-lg mb-1">
                              {dept}
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {books.filter((b) => b.category === dept).length}{" "}
                              Titles
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {filteredBooks
                          .filter((b) => b.category === selectedDept)
                          .map((book) => (
                            <div
                              key={book._id}
                              className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-400 transition-all duration-300"
                            >
                              {/* Left Color Accent - Changes based on stock */}
                              <div
                                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                  book.availableCopies > 5
                                    ? "bg-indigo-500"
                                    : "bg-red-500"
                                }`}
                              />

                              <div className="flex flex-col lg:flex-row p-5 gap-6">
                                {/* Section 1: Visual Identity */}
                                <div className="flex gap-4 shrink-0">
                                  <div className="relative">
                                    <img
                                      src={book.coverImage}
                                      alt={book.title}
                                      className="w-20 lg:w-20 lg:mt-7 object-cover rounded-lg shadow-sm border border-slate-100 group-hover:rotate-1 transition-transform"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-white shadow-lg border border-slate-100 rounded-lg px-2 py-1 flex items-center gap-1">
                                      <span className="text-amber-400 text-xs">
                                        ★
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-700">
                                        {book.rating}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col justify-center lg:hidden">
                                    <h4 className="font-bold text-slate-900 text-lg leading-tight">
                                      {book.title}
                                    </h4>
                                    <p className="text-sm text-indigo-600 font-medium">
                                      {book.author}
                                    </p>
                                  </div>
                                </div>

                                {/* Section 2: Core Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                  <div className="hidden lg:block">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                          {book.category}
                                        </span>
                                        <h4 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                          {book.title}
                                        </h4>
                                        <p className="text-slate-500 font-medium">
                                          by {book.author}
                                        </p>
                                      </div>

                                      {/* Actions Integrated into Top Right */}
                                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => {
                                            setEditingBook(book);
                                            setNewBook({
                                              title: book.title || "",
                                              author: book.author || "",
                                              category: book.category || "",
                                              rating: book.rating || "",
                                              totalCopies:
                                                book.totalCopies || "",
                                              availableCopies:
                                                book.availableCopies || "",
                                              shelf: book.shelf || "",
                                              isbn: book.isbn || "",
                                              publisher: book.publisher || "",
                                              publishedYear:
                                                book.publishedYear || "",
                                              description:
                                                book.description || "",
                                              coverImage: null, // optional (don’t preload file)
                                            });
                                            setEditingBook(book);
                                            setNewBook(book);
                                            setShowAddBookModal(true);
                                          }}
                                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg shadow-sm transition-all"
                                        >
                                          <Edit3 size={16} />
                                        </button>
                                        <button
                                          onClick={() => setBookToDelete(book)}
                                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg shadow-sm transition-all"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="mt-3 text-sm text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                                    {book.description}
                                  </p>

                                  {/* Section 3: Professional Data Points */}
                                  <div className="mt-4 flex flex-wrap items-center gap-y-4 gap-x-8 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <span className="text-[10px] font-bold uppercase">
                                          Shelf
                                        </span>
                                      </div>
                                      <p className="text-xs font-bold text-slate-700">
                                        {book.shelf}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <span className="text-[10px] font-bold uppercase">
                                          Status
                                        </span>
                                      </div>
                                      <div
                                        className={`text-xs font-bold flex items-center gap-1.5 ${
                                          book.availableCopies > 5
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                        }`}
                                      >
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                            book.availableCopies > 5
                                              ? "bg-emerald-500"
                                              : "bg-red-500"
                                          }`}
                                        />
                                        {book.availableCopies} of{" "}
                                        {book.totalCopies} Available
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-auto">
                                      <span className="text-[10px] font-mono text-slate-300">
                                        ID: {book._id.slice(-6).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/*DELETE CONFIRM MODEL */}

          {bookToDelete && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
                <h3 className="text-xl font-black text-red-600">
                  Confirm Deletion
                </h3>

                <p className="text-sm text-slate-600 font-medium">
                  Are you sure you want to delete
                  <span className="font-black"> "{bookToDelete.title}"</span>?
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setBookToDelete(null)}
                    className="flex-1 py-3 rounded-xl font-black text-xs uppercase
                     bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleDeleteBook(bookToDelete._id)}
                    disabled={isDeletingBook}
                    className="flex-1 py-3 rounded-xl font-black text-xs uppercase
                     bg-red-600 text-white hover:bg-red-700
                     disabled:bg-slate-400"
                  >
                    {isDeletingBook ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- MODAL: ADD AND EDITE NEW BOOK --- */}
          {showAddBookModal && (
            <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300 z-110">
              {/* Main Container with subtle glass border */}
              <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 flex flex-col md:flex-row min-h-[650px]">
                {/* LEFT ACCENT PANEL: Visual Identity */}
                <div className="md:w-72 bg-gradient-to-b from-blue-600 via-blue-900 to-black p-10 flex flex-col justify-between text-white relative">
                  {/* Animated Mesh Gradient Overlay */}
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                    <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_50%)] animate-pulse"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/30 shadow-xl">
                      <BookOpen size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-4xl font-black leading-[0.9] tracking-tighter italic">
                      {" "}
                      {isEditMode ? (
                        <>
                          UPDATE <br /> BOOK
                        </>
                      ) : (
                        <>
                          ADD <br /> NEW BOOK
                        </>
                      )}
                    </h3>
                    <div className="h-1 w-12 bg-indigo-300 mt-6 rounded-full"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 opacity-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                          Live Registry
                        </span>
                      </div>
                      <p className="text-indigo-100/60 text-[10px] leading-relaxed font-medium">
                        Ensure all mandatory fields are verified before
                        authorizing the database entry.
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT CONTENT PANEL: Interactive Form */}
                <div className="flex-1 bg-[#f8fafc] flex flex-col relative">
                  {/* Elegant Close Button */}
                  <div className="absolute top-8 right-8 z-20">
                    <button
                      onClick={() => {setShowAddBookModal(false);
                        handleCloseModal();}
                      }
                      className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 rounded-2xl transition-all duration-300 active:scale-90 border border-slate-100"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>

                  {/* Scrollable Container */}
                  <div className="px-12 pt-16 pb-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Group 1: Identity */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg">
                          01
                        </span>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                          Identity & Origin
                        </h4>
                      </div>

                      <div className="grid gap-6">
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder="Official Publication Title *"
                            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 outline-none transition-all focus:border-indigo-500 focus:shadow-[0_15px_30px_-10px_rgba(79,70,229,0.15)] font-bold text-slate-700 placeholder:text-slate-300"
                            value={newBook.title}
                            onChange={(e) =>
                              setNewBook({ ...newBook, title: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Primary Author *"
                            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none transition-all focus:border-indigo-500 font-bold text-slate-700"
                            value={newBook.author}
                            onChange={(e) =>
                              setNewBook({ ...newBook, author: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Department/Category *"
                            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none transition-all focus:border-indigo-500 font-bold text-slate-700"
                            value={newBook.category}
                            onChange={(e) =>
                              setNewBook({
                                ...newBook,
                                category: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Group 2: Quantitative Data */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg">
                          02
                        </span>
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                          Logistics & Stock
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            label: "Total Stock",
                            val: newBook.totalCopies,
                            key: "totalCopies",
                            type: "number",
                          },
                          {
                            label: "Available",
                            val: newBook.availableCopies,
                            key: "availableCopies",
                            type: "number",
                          },
                          {
                            label: "Shelf Ref",
                            val: newBook.shelf,
                            key: "shelf",
                            type: "text",
                          },
                        ].map((field) => (
                          <div key={field.key} className="group flex flex-col">
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-4 mb-2">
                              {field.label}
                            </span>
                            <input
                              type={field.type}
                              className="w-full bg-slate-50 border-2 border-transparent group-hover:bg-slate-100 rounded-2xl px-5 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-all font-black text-slate-700"
                              value={field.val}
                              onChange={(e) =>
                                setNewBook({
                                  ...newBook,
                                  [field.key]: e.target.value,
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Group 3: Archival Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        placeholder="Rating (1-5)"
                        className="bg-slate-100/50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newBook.rating}
                        onChange={(e) =>
                          setNewBook({ ...newBook, rating: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="ISBN"
                        className="bg-slate-100/50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newBook.isbn}
                        onChange={(e) =>
                          setNewBook({ ...newBook, isbn: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        placeholder="Pub. Year"
                        className="bg-slate-100/50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newBook.publishedYear}
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            publishedYear: e.target.value,
                          })
                        }
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Publisher Name"
                      className="w-full bg-white border-2 border-slate-100 rounded-2xl px-8 py-4 outline-none focus:border-indigo-500 font-bold text-slate-700"
                      value={newBook.publisher}
                      onChange={(e) =>
                        setNewBook({ ...newBook, publisher: e.target.value })
                      }
                    />

                    <textarea
                      placeholder="Technical Abstract / Description..."
                      rows={3}
                      className="w-full bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-6 outline-none focus:border-indigo-500 font-medium text-slate-600 transition-all resize-none shadow-sm"
                      value={newBook.description}
                      onChange={(e) =>
                        setNewBook({ ...newBook, description: e.target.value })
                      }
                    />

                    {/* Upload Interactive Card */}
                    <label className="relative group flex flex-col items-center justify-center w-full h-40 bg-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-[2.5rem] cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-3 bg-white rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 mb-3">
                          <Upload size={20} className="text-indigo-600" />
                        </div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                          {newBook.coverImage
                            ? newBook.coverImage.name
                            : "Drop Cover Asset"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setNewBook({
                            ...newBook,
                            coverImage: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  </div>

                  {/* Action Footer */}
                  <div className="p-10 bg-gradient-to-b from-black to-black border-t border-slate-50 flex items-center justify-between">
                    <div className="hidden sm:block">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        Auth Level: Librarian
                      </span>
                    </div>
                    <button
                      onClick={() => {
  if (isEditMode) {
    handleUpdateBook();
  } else {
    handleAddBook();
  }
  handleCloseModal(); // now properly called
}}
                      disabled={isAddingBook || isUpdatingBook}
                      className={`w-full sm:w-auto px-14 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all 
    ${
      isEditMode
        ? "bg-emerald-600 hover:bg-emerald-700"
        : "bg-[#30299c] text-white hover:bg-indigo-600"
    }
    ${(isAddingBook || isUpdatingBook) && "bg-slate-400 cursor-not-allowed"}
  `}
                    >
                      {isAddingBook || isUpdatingBook ? (
                        <span className="flex items-center gap-3">
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                          />
                          {isEditMode ? "Updating…" : "Registering…"}
                        </span>
                      ) : isEditMode ? (
                        "Update Book"
                      ) : (
                        "Register Entry"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- CONFIRMATION WINDOW (RETURN) --- */}
          {showReturnConfirm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-6">
              <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase">
                    Confirm Return?
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    Mark{" "}
                    <span className="text-indigo-600 font-bold">
                      "{showReturnConfirm.bookTitle}"
                    </span>{" "}
                    as returned?
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <button
                      onClick={() => setShowReturnConfirm(null)}
                      className="py-4 rounded-2xl font-black uppercase text-[10px] text-slate-400 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmReturn}
                      className="bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-emerald-100"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- ISSUE MODAL --- */}
          {showIssueModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    Issue Entry
                  </h3>
                  <X
                    onClick={() =>{ setShowIssueModal(false)}}
                    className="cursor-pointer"
                  />
                </div>
                <div className="p-8 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Student Name"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, student: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Roll No"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      onChange={(e) =>
                        setNewIssue({ ...newIssue, roll: e.target.value })
                      }
                    />
                  </div>
                  <select
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                    onChange={(e) =>
                      setNewIssue({ ...newIssue, bookTitleId: e.target.value })
                    }
                  >
                    <option value="">Select Book Title</option>
                    {books
                      .filter((b) => b.stock > 0)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title}
                        </option>
                      ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Physical Tag ID (e.g. CS-10)"
                    className="w-full p-4 bg-indigo-50/50 rounded-2xl outline-none font-bold text-sm border-2 border-indigo-100"
                    onChange={(e) =>
                      setNewIssue({
                        ...newIssue,
                        specificBookId: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={handleIssueBook}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-indigo-700 transition-all"
                  >
                    Confirm Issue
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
