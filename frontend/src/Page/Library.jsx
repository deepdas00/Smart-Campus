import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  User,
  Calendar,
  MapPin,
  X,
  Check,
  QrCode,
  BookMarked,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import CollegeInfo from "../Components/CollegeInfo";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";
import ProfileSidebar from "../Components/ProfileSidebar";
import Navbar from "../Components/Navbar/Navbar";

export default function Library() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showMyBooks, setShowMyBooks] = useState(false);
  const [bookReceived, setBookReceived] = useState(false);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
const [loadingHistory, setLoadingHistory] = useState(true);
const [showQRPreview, setShowQRPreview] = useState(false);
const [activeTransaction, setActiveTransaction] = useState(null);



const normalizeTransaction = (tx) => ({
  id: tx._id,
  qrCode: tx.qrCode,
  issueDate: new Date(tx.createdAt).toLocaleDateString(),
  dueDate: new Date(tx.dueDate).toLocaleDateString(),
  status: tx.transactionStatus,
  book: tx.bookId, // 👈 KEY FIX
});





const fetchTransactionDetails = async (transactionId) => {
  try {
    setLoading(true);

    const token = Cookies.get("accessToken");

    const { data } = await axios.get(
      `${API_URL}/api/v1/library/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log(data);
    

    if (data?.success) {
      setBookingDetails(normalizeTransaction(data.data));
      setBookingSuccess(true);
      setBookReceived(false);
    }
  } catch (error) {
    console.error(error.response || error);
    alert("Failed to fetch transaction details");
  } finally {
    setLoading(false);
  }
};







const fetchLibraryHistory = async () => {
  try {
    const token = Cookies.get("accessToken"); // or localStorage.getItem("token")

    console.log("Tokennnnn",token);
    

    const res = await axios.get(
      `${API_URL}/api/v1/library/my/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // console.log("History:", res.data);
    setHistory(res.data.data);
  } catch (error) {
    console.error("Failed to fetch history", error);
  } finally {
    setLoadingHistory(false);
  }
};


useEffect(() => {
  fetchLibraryHistory();
}, []);





  const categories = [
    { id: "all", name: "All Books", icon: "📚" },
    { id: "programming", name: "Programming", icon: "💻" },
    { id: "science", name: "Science", icon: "🔬" },
    { id: "mathematics", name: "Mathematics", icon: "📐" },
    { id: "literature", name: "Literature", icon: "📖" },
    { id: "history", name: "History", icon: "🏛️" },
    { id: "engineering", name: "Engineering", icon: "⚙️" },
  ];
  const normalizeBooks = (apiBooks) => {
    return apiBooks.map((b) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      category: b.category.toLowerCase(), // filter compatibility
      rating: b.rating,
      available: b.availableCopies,
      total: b.totalCopies,
      shelf: b.shelf,
      isbn: b.isbn,
      publisher: b.publisher,
      year: b.publishedYear,
      description: b.description,
      coverImage: b.coverImage, // image URL
    }));
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        
const token = Cookies.get("accessToken");

        console.log("from the fetched Book", token);
        

        const res = await axios.get(`${API_URL}/api/v1/library/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const rawBooks = res.data?.data || [];

        console.log(rawBooks);

        const formattedBooks = normalizeBooks(rawBooks);

        setBooks(formattedBooks);
      } catch (err) {
        console.error(err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const simulateBookCollection = () => {
    setBookReceived(true);
    const updatedBooking = { ...bookingDetails, status: "collected" };
    setIssuedBooks(
      issuedBooks.map((b) => (b.id === bookingDetails.id ? updatedBooking : b))
    );

    setTimeout(() => {
      setBookReceived(false);
      setBookingSuccess(false);
      setBookingDetails(null);
    }, 5000);
  };

  const filteredBooks = Array.isArray(books)
    ? books.filter((book) => {
        const title = book.title?.toLowerCase() || "";
        const author = book.author?.toLowerCase() || "";
        const category = book.category || "";

        const search = searchQuery.toLowerCase();

        const matchesSearch = title.includes(search) || author.includes(search);

        const matchesCategory =
          selectedCategory === "all" || category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
    : [];

  const pendingBooks = issuedBooks.filter((b) => b.status === "pending");
  const collectedBooks = issuedBooks.filter((b) => b.status === "collected");

const issueBook = async (book) => {
  try {
    const token = Cookies.get("accessToken");
    console.log("Token:", token);
    console.log("Issuing book ID:", book.id);

    const res = await axios.post(
      `${API_URL}/api/v1/library/order`,
      { bookId: book.id },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    const transaction = res.data.data;

    const booking = {
      id: transaction._id,
      book: book,
      issueDate: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      qrCode: transaction.qrCode,
      status: "pending",
    };

    setBookingDetails(booking);
    setBookingSuccess(true);
    setShowIssueModal(false);
    setIssuedBooks([...issuedBooks, booking]);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to issue book");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <Navbar/>

      {/* Profile menu side bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/*Banner*/}
      <CollegeInfo />

      <button
                onClick={() => setShowMyBooks(true)}
                className="fixed top-3 right-[20%] px-4 py-2 bg-blue-700  text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2 z-100"
              >
                <BookMarked className="w-5 h-5" />
                <span className="hidden sm:inline">My Books</span>
                
              </button>

      {/* Book Collection Success */}
      {bookReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Book Collected!
            </h2>
            <p className="text-gray-600 mb-4">
              Enjoy your reading. Please return by the due date.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                {bookingDetails?.book.title}
              </p>
              <p className="text-green-600 text-sm">
                Due: {bookingDetails?.dueDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {bookingSuccess && !bookReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-1000">
          <div className="bg-white  shadow-2xl max-w-md w-full">
            <div className="bg-blue-700 text-white  px-6 py-2">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-indigo-100 mt-1">
                Show this QR code at the library counter
              </p>
            </div>

            <div className="p-6 py-4 space-y-4">
              <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl p-2 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  
                  <div className="bg-white p-4 py-2 rounded-lg shadow-inner mb-1">
                    <div className="text-1xl font-bold text-gray-800">
                      {bookingDetails?.qrCode && (
                        <img
                          src={bookingDetails.qrCode}
                          alt="QR Code"
                          className="mx-auto w-32 h-32"
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Booking ID: {bookingDetails?.id}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center gap-6 p-4 bg-slate-50/80 border border-slate-200 group hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
  {/* Left: Book Cover with Reflection Effect */}
  <div className="relative shrink-0">
    <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
    <img
      src={bookingDetails?.book.coverImage}
      alt={bookingDetails?.book.title}
      className="relative w-20 h-28 object-cover rounded-xl shadow-md transform group-hover:-rotate-2 group-hover:scale-105 transition-all duration-500"
    />
  </div>

  {/* Center: Content Divider Line */}
  <div className="h-16 w-px bg-slate-200 group-hover:bg-indigo-200 transition-colors hidden sm:block" />

  {/* Right: Textual Information */}
  <div className="flex-1 min-w-0">
    <div className="flex flex-col gap-1">
        
      <h3 className="font-extrabold text-slate-900 text-lg leading-tight truncate group-hover:text-indigo-600 transition-colors">
        {bookingDetails?.book.title}
      </h3>
      
      <div className="flex items-center gap-2">
        <div className="w-4 h-px bg-slate-300" />
        <p className="text-sm font-medium text-slate-500 italic">
          {bookingDetails?.book.author}
        </p>
      </div>
    </div>

    {/* Footer Detail (e.g., ID or Shelf) */}
    <div className="mt-3 flex items-center gap-3">
      <div className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400">
        ISBN: {bookingDetails?.book.isbn?.slice(-4) || '7432'}
      </div>
    </div>
  </div>
</div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold">
                      {bookingDetails?.issueDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold text-red-600">
                      {bookingDetails?.dueDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shelf Location:</span>
                    <span className="font-semibold">
                      {bookingDetails?.book.shelf}
                    </span>
                  </div>
                </div>
              </div>

              {/* <button
                onClick={simulateBookCollection}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Simulate QR Scan (Demo)</span>
              </button> */}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Books must be returned within 14 days.
                  Late returns may result in fines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Books Sidebar */}
     {showMyBooks && (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[250] transition-all animate-in fade-in duration-300">
    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
      
      {/* Header: Minimalist & Bold */}
      <div className="relative p-8 pb-6 mb-5 bg-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-white font-bold ">My Book</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
              <p className="text-xs font-bold text-slate-100 uppercase tracking-widest">
                {history.length} active sessions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMyBooks(false)}
            className="group bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white rounded-full p-3 transition-all duration-300"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-10 scrollbar-hide">
        {loadingHistory ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Syncing your records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">Your shelf is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
      
              
              const isFined = item.fineAmount > 0;
              const isPending = item.transactionStatus === "pending";

              return (
                <div
                  key={item._id}
                 onClick={() => fetchTransactionDetails(item._id)}

                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                    isFined 
                      ? "bg-rose-50/40 border-rose-100" 
                      : "bg-white border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                  }`}
                >
                  {/* The Layout Container - Forced Vertical on Mobile to avoid X-scroll */}
                  <div className="p-4 flex flex-col gap-4">
                    
                    {/* Top Section: Cover and Title */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={item.bookId.coverImage}
                          alt={item.bookId.title}
                          className="w-16 h-22 object-cover rounded-xl shadow-lg ring-1 ring-black/5"
                        />
                        {isFined && (
                          <div className="absolute -top-2 -left-2 bg-rose-500 text-white p-1 rounded-lg shadow-lg">
                            <AlertCircle className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors ${isFined ? 'text-rose-900' : ''}`}>
                          {item.bookId.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 mt-1 italic uppercase tracking-tighter">
                          {item.bookId.author}
                        </p>
                        
                        {/* Inline Status Badge */}
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border ${
                            isPending ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-indigo-50 text-indigo-600 border-indigo-200"
                          }`}>
                            {item.transactionStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section: Details Grid (2-column grid for compactness) */}
                    <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl ${isFined ? 'bg-rose-100/50' : 'bg-slate-50'}`}>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Issue Date</p>
                        <p className="text-xs font-bold text-slate-700">
                          {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Fine Accrued</p>
                        <p className={`text-xs font-black ${isFined ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {isFined ? `$${item.fineAmount}` : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Red Accent for Fines */}
                  {isFined && (
                    <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-rose-500/10 rounded-full blur-xl" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-6 border-t border-slate-50 text-center bg-blue-500">
        <p className="text-[10px] text-slate-200 font-bold uppercase tracking-[0.3em]">
          College Library Management
        </p>
      </div>
    </div>
  </div>
)}

      {/* Book Details Modal */}
      {showIssueModal  && (
        <div className="z-1000 fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row ring-1 ring-black/5">
            {/* Left Panel: Visual & Identity */}
            <div className="md:w-5/12 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="relative w-48 h-64 object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full mb-3">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-700">
                    {selectedBook.rating}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Reference ID
                </p>
                <p className="text-sm font-mono text-slate-600">
                  #{selectedBook.isbn?.slice(-6) || "N/A"}
                </p>
              </div>
            </div>

            {/* Right Panel: Information & Action */}
            <div className="md:w-7/12 p-8 flex flex-col relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowIssueModal(false);
                  setSelectedBook(null);
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 pr-8">
                <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">
                  Educational Resource
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-1 mb-2 leading-tight">
                  {selectedBook.title}
                </h2>
                <p className="text-lg font-medium text-slate-500">
                  By {selectedBook.author}
                </p>
              </div>

              <div className="space-y-6 flex-1">
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-y border-slate-100 py-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        selectedBook.available > 0
                          ? "text-emerald-600"
                          : "text-rose-500"
                      }`}
                    >
                      {selectedBook.available > 0
                        ? "Available for Issue"
                        : "Out of Stock"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Shelf Location
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedBook.shelf}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Issue Duration
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      14 Business Days
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Total Stock
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {selectedBook.total} Copies
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {selectedBook.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={() => issueBook(selectedBook)}
                  disabled={selectedBook.available === 0}
                  className={`w-full py-4 rounded-2xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
                    selectedBook.available > 0
                      ? "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  {selectedBook.available > 0
                    ? "CONFIRM DIGITAL ISSUE"
                    : "CURRENTLY UNAVAILABLE"}
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
                  By confirming, you agree to the library's terms of digital
                  lending.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {books.length}
                </div>
                <div className="text-xs text-gray-600">Total Books</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {books.reduce((sum, book) => sum + book.available, 0)}
                </div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {issuedBooks.length}
                </div>
                <div className="text-xs text-gray-600">My Issues</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {pendingBooks.length}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-blue-700 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
        {loading && (
          <div className="text-center py-20 text-lg font-semibold text-gray-500">
            Loading books...
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-600 font-semibold">
            {error}
          </div>
        )}
        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group relative flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] "
            >
              {/* Top Section: Visual Impact */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Floating Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md backdrop-blur-md shadow-sm ${
                      book.available > 0
                        ? "bg-white/90 text-emerald-600"
                        : "bg-white/90 text-rose-600"
                    }`}
                  >
                    {book.available > 0 ? "● Available" : "● Issued"}
                  </span>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg text-white">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold">{book.rating}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                    Section {book.shelf}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    By {book.author}
                  </p>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">
                  {book.description}
                </p>

                {/* Stats Row */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Copies
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {book.available}/{book.total}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        Limit
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        14d
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setShowIssueModal(true);
                    }}
                    disabled={book.available === 0}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      book.available > 0
                        ? "bg-slate-900 text-white hover:bg-indigo-600 hover:rotate-12 shadow-lg"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }`}
                    title={
                      book.available > 0 ? "Issue Digitally" : "Unavailable"
                    }
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
