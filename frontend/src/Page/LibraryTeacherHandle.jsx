import React, { useState } from "react";
import {
  Search,
  Plus,
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
  // --- STATE SECTIONS ---
  const [activeTab, setActiveTab] = useState("transactions");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // Track book being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [showReturnConfirm, setShowReturnConfirm] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  const [newIssue, setNewIssue] = useState({
    student: "",
    roll: "",
    bookTitleId: "",
    specificBookId: "",
  });

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    stock: "",
    category: "",
    id: "",
  });

  const [books, setBooks] = useState([
    {
      id: "B-101",
      title: "Data Structures",
      author: "N. Karumanchi",
      stock: 5,
      category: "Tech",
    },
    {
      id: "B-102",
      title: "Atomic Habits",
      author: "James Clear",
      stock: 2,
      category: "Self-Help",
    },
    {
      id: "B-103",
      title: "Modern Psychology",
      author: "S. Freud",
      stock: 0,
      category: "Science",
    },
    {
      id: "B-104",
      title: "Clean Code",
      author: "Robert Martin",
      stock: 3,
      category: "Tech",
    },

    {
      id: "B-105",
      title: "Introduction to Algorithms",
      author: "CLRS",
      stock: 4,
      category: "Tech",
    },
    {
      id: "B-106",
      title: "You Don't Know JS",
      author: "Kyle Simpson",
      stock: 6,
      category: "Tech",
    },
    {
      id: "B-107",
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      stock: 5,
      category: "Tech",
    },
    {
      id: "B-108",
      title: "Deep Work",
      author: "Cal Newport",
      stock: 3,
      category: "Self-Help",
    },
    {
      id: "B-109",
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      stock: 2,
      category: "Psychology",
    },
    {
      id: "B-110",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      stock: 7,
      category: "History",
    },

    {
      id: "B-111",
      title: "The Alchemist",
      author: "Paulo Coelho",
      stock: 6,
      category: "Fiction",
    },
    {
      id: "B-112",
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      stock: 4,
      category: "Finance",
    },
    {
      id: "B-113",
      title: "The Lean Startup",
      author: "Eric Ries",
      stock: 3,
      category: "Business",
    },
    {
      id: "B-114",
      title: "Design Patterns",
      author: "Erich Gamma",
      stock: 2,
      category: "Tech",
    },
    {
      id: "B-115",
      title: "Refactoring",
      author: "Martin Fowler",
      stock: 5,
      category: "Tech",
    },

    {
      id: "B-116",
      title: "Zero to One",
      author: "Peter Thiel",
      stock: 4,
      category: "Business",
    },
    {
      id: "B-117",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      stock: 6,
      category: "Finance",
    },
    {
      id: "B-118",
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      stock: 5,
      category: "Tech",
    },
    {
      id: "B-119",
      title: "Cracking the Coding Interview",
      author: "Gayle Laakmann",
      stock: 3,
      category: "Tech",
    },
    {
      id: "B-120",
      title: "Grokking Algorithms",
      author: "Aditya Bhargava",
      stock: 7,
      category: "Tech",
    },

    {
      id: "B-121",
      title: "The Power of Habit",
      author: "Charles Duhigg",
      stock: 4,
      category: "Self-Help",
    },
    {
      id: "B-122",
      title: "AI Superpowers",
      author: "Kai-Fu Lee",
      stock: 2,
      category: "AI",
    },
    {
      id: "B-123",
      title: "Life 3.0",
      author: "Max Tegmark",
      stock: 3,
      category: "AI",
    },
    {
      id: "B-124",
      title: "Introduction to Machine Learning",
      author: "Ethem Alpaydin",
      stock: 2,
      category: "AI",
    },
    {
      id: "B-125",
      title: "Hands-On Machine Learning",
      author: "Aurélien Géron",
      stock: 4,
      category: "AI",
    },

    {
      id: "B-126",
      title: "The Art of Computer Programming",
      author: "Donald Knuth",
      stock: 1,
      category: "Tech",
    },
    {
      id: "B-127",
      title: "Structure and Interpretation of Computer Programs",
      author: "Harold Abelson",
      stock: 2,
      category: "Tech",
    },
    {
      id: "B-128",
      title: "Operating System Concepts",
      author: "Silberschatz",
      stock: 3,
      category: "Tech",
    },
    {
      id: "B-129",
      title: "Computer Networks",
      author: "Andrew Tanenbaum",
      stock: 4,
      category: "Tech",
    },
    {
      id: "B-130",
      title: "Database System Concepts",
      author: "Abraham Silberschatz",
      stock: 5,
      category: "Tech",
    },

    {
      id: "B-131",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      stock: 6,
      category: "Fiction",
    },
    {
      id: "B-132",
      title: "1984",
      author: "George Orwell",
      stock: 4,
      category: "Fiction",
    },
    {
      id: "B-133",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      stock: 3,
      category: "Fiction",
    },
    {
      id: "B-134",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      stock: 5,
      category: "Fiction",
    },
    {
      id: "B-135",
      title: "Harry Potter",
      author: "J.K. Rowling",
      stock: 8,
      category: "Fiction",
    },

    {
      id: "B-136",
      title: "Brief History of Time",
      author: "Stephen Hawking",
      stock: 2,
      category: "Science",
    },
    {
      id: "B-137",
      title: "Cosmos",
      author: "Carl Sagan",
      stock: 4,
      category: "Science",
    },
    {
      id: "B-138",
      title: "Astrophysics for People in a Hurry",
      author: "Neil deGrasse Tyson",
      stock: 3,
      category: "Science",
    },
    {
      id: "B-139",
      title: "Thinking in Bets",
      author: "Annie Duke",
      stock: 2,
      category: "Psychology",
    },
    {
      id: "B-140",
      title: "Man's Search for Meaning",
      author: "Viktor Frankl",
      stock: 5,
      category: "Psychology",
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: "TX-9921",
      student: "Arjun Mehta",
      roll: "CS-204",
      book: "Data Structures",
      specificId: "DS-001",
      date: "22 Dec",
      status: "issued",
    },
    {
      id: "TX-9922",
      student: "Karan Singh",
      roll: "ME-102",
      book: "Atomic Habits",
      specificId: "AH-042",
      date: "18 Dec",
      status: "overdue",
    },

    {
      id: "TX-9923",
      student: "Riya Sharma",
      roll: "CS-110",
      book: "Clean Code",
      specificId: "CC-014",
      date: "20 Dec",
      status: "issued",
    },
    {
      id: "TX-9924",
      student: "Aman Verma",
      roll: "IT-221",
      book: "Introduction to Algorithms",
      specificId: "CLRS-009",
      date: "17 Dec",
      status: "returned",
    },
    {
      id: "TX-9925",
      student: "Sneha Patel",
      roll: "CS-305",
      book: "You Don't Know JS",
      specificId: "JS-121",
      date: "21 Dec",
      status: "issued",
    },

    {
      id: "TX-9926",
      student: "Rahul Nair",
      roll: "AI-101",
      book: "Hands-On Machine Learning",
      specificId: "ML-077",
      date: "15 Dec",
      status: "overdue",
    },
    {
      id: "TX-9927",
      student: "Pooja Gupta",
      roll: "CS-402",
      book: "Grokking Algorithms",
      specificId: "GA-033",
      date: "19 Dec",
      status: "returned",
    },
    {
      id: "TX-9928",
      student: "Vikram Joshi",
      roll: "EE-210",
      book: "Deep Work",
      specificId: "DW-056",
      date: "16 Dec",
      status: "issued",
    },

    {
      id: "TX-9929",
      student: "Ananya Roy",
      roll: "HS-115",
      book: "Sapiens",
      specificId: "SP-091",
      date: "14 Dec",
      status: "issued",
    },
    {
      id: "TX-9930",
      student: "Mohit Bansal",
      roll: "CS-501",
      book: "Cracking the Coding Interview",
      specificId: "CCI-118",
      date: "13 Dec",
      status: "overdue",
    },

    {
      id: "TX-9931",
      student: "Neha Kapoor",
      roll: "AI-203",
      book: "Life 3.0",
      specificId: "AI-045",
      date: "18 Dec",
      status: "issued",
    },
    {
      id: "TX-9932",
      student: "Sahil Khan",
      roll: "CS-330",
      book: "Refactoring",
      specificId: "RF-022",
      date: "12 Dec",
      status: "returned",
    },

    {
      id: "TX-9933",
      student: "Ishita Malhotra",
      roll: "BA-109",
      book: "The Psychology of Money",
      specificId: "PM-064",
      date: "20 Dec",
      status: "issued",
    },
    {
      id: "TX-9934",
      student: "Aditya Kulkarni",
      roll: "CS-222",
      book: "Eloquent JavaScript",
      specificId: "EJS-087",
      date: "19 Dec",
      status: "issued",
    },

    {
      id: "TX-9935",
      student: "Nikhil Arora",
      roll: "CS-150",
      book: "Operating System Concepts",
      specificId: "OS-031",
      date: "11 Dec",
      status: "overdue",
    },
    {
      id: "TX-9936",
      student: "Kritika Jain",
      roll: "PH-108",
      book: "Brief History of Time",
      specificId: "BH-010",
      date: "10 Dec",
      status: "returned",
    },

    {
      id: "TX-9937",
      student: "Rohit Iyer",
      roll: "CS-410",
      book: "Computer Networks",
      specificId: "CN-055",
      date: "21 Dec",
      status: "issued",
    },
    {
      id: "TX-9938",
      student: "Simran Kaur",
      roll: "EN-202",
      book: "1984",
      specificId: "FIC-1984-12",
      date: "18 Dec",
      status: "issued",
    },

    {
      id: "TX-9939",
      student: "Harsh Vardhan",
      roll: "CS-399",
      book: "Design Patterns",
      specificId: "DP-019",
      date: "15 Dec",
      status: "returned",
    },
    {
      id: "TX-9940",
      student: "Aditi Chawla",
      roll: "PS-101",
      book: "Man's Search for Meaning",
      specificId: "MSM-027",
      date: "17 Dec",
      status: "issued",
    },
  ]);


  

  // Derived departments
  const departments = [...new Set(books.map((b) => b.category))];

  // --- LOGIC SECTION ---
  const stats = {
    totalBooksInLibrary: books.reduce(
      (acc, book) => acc + parseInt(book.stock || 0),
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

  const handleAddBook = () => {
    if (!newBook.title || !newBook.category || !newBook.id) {
      alert("Please fill title, category, and book ID");
      return;
    }
    setBooks([...books, { ...newBook, stock: parseInt(newBook.stock) || 0 }]);
    setShowAddBookModal(false);
    setNewBook({ title: "", author: "", stock: "", category: "", id: "" });
  };

  const handleUpdateBook = () => {
    setBooks(books.map((b) => (b.id === editingBook.id ? editingBook : b)));
    setEditingBook(null);
  };

  const handleDeleteBook = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book title from inventory?"
      )
    ) {
      setBooks(books.filter((b) => b.id !== id));
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
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Filter Books (Inventory)
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="pt-15">
        <CollegeInfo />
        <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans text-slate-900 ">
          {/* --- TOP NAVIGATION BAR --- */}
          <LibraryHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
            {/* --- LEFT SIDEBAR --- */}
            <LibrarySidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setSelectedDept={setSelectedDept}
              setShowIssueModal={setShowIssueModal}
            />

            {/* --- MAIN CONTENT --- */}
            <div className="lg:col-span-9 space-y-6">
              {/* STATS SECTION */}
              <StatsGrid stats={stats} />

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden min-h-[400px]">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center  bg-blue-200">
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
                  <TransactionsTable
                    transactions={filteredTransactions}
                    setShowReturnConfirm={setShowReturnConfirm}
                  />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {books
                          .filter((b) => b.category === selectedDept)
                          .map((book) => (
                            <div
                              key={book.id}
                              className="p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex justify-between items-center group"
                            >
                              <div>
                                <h4 className="font-black text-slate-800">
                                  {book.title}
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                  {book.author}
                                </p>
                                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditingBook(book)}
                                    className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-100 hover:text-indigo-600"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBook(book.id)}
                                    className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-red-100 hover:text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`text-lg font-black block ${
                                    book.stock > 0
                                      ? "text-slate-800"
                                      : "text-red-400"
                                  }`}
                                >
                                  {book.stock} left
                                </span>
                                <span className="text-[9px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">
                                  #{book.id}
                                </span>
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

          {/* --- MODAL: EDIT BOOK --- */}
          {editingBook && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border-4 border-indigo-500">
                <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase">
                    Edit Book Details
                  </h3>
                  <X
                    onClick={() => setEditingBook(null)}
                    className="cursor-pointer"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      value={editingBook.title}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                        Author
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                        value={editingBook.author}
                        onChange={(e) =>
                          setEditingBook({
                            ...editingBook,
                            author: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                        Category
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                        value={editingBook.category}
                        onChange={(e) =>
                          setEditingBook({
                            ...editingBook,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Available Stock
                    </label>
                    <input
                      type="number"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      value={editingBook.stock}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <button
                    onClick={handleUpdateBook}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- MODAL: ADD NEW BOOK --- */}
          {showAddBookModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase">
                    Add New Asset
                  </h3>
                  <X
                    onClick={() => setShowAddBookModal(false)}
                    className="cursor-pointer"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <input
                    type="text"
                    placeholder="Book Title"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Author"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      value={newBook.author}
                      onChange={(e) =>
                        setNewBook({ ...newBook, author: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Category/Dept"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      value={newBook.category}
                      onChange={(e) =>
                        setNewBook({ ...newBook, category: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Asset ID (e.g. B-105)"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      value={newBook.id}
                      onChange={(e) =>
                        setNewBook({ ...newBook, id: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Total Stock"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                      value={newBook.stock}
                      onChange={(e) =>
                        setNewBook({ ...newBook, stock: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={handleAddBook}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                  >
                    Register Book
                  </button>
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
                    onClick={() => setShowIssueModal(false)}
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
