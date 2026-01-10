import { use, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, Toaster } from "react-hot-toast";

import {
  BookOpen,
  Search,
  Star,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  X,
  Check,
  QrCode,
} from "lucide-react";
// import CollegeInfo from "../Components/CollegeInfo";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";
import ProfileSidebar from "../Components/ProfileSidebar";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";

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
  const [processingId, setProcessingId] = useState(null);

  const formatDateTime = (isoDate) => {
    if (!isoDate) return "Collect the Book";

    const date = new Date(isoDate);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} (${formattedTime})`;
  };

  //non : - nothing
  //paid: - already ache
  //pending :- fine ache

  const startLibraryFinePayment = async (transactionId) => {
    try {


      const res = await axios.patch(
        `${API_URL}/api/v1/library/return/pay/${transactionId}`,
        {},
        { withCredentials: true }
      );

      const { razorpayOrderId, amount, currency, key } = res.data.data;

      openLibraryRazorpay({
        razorpayOrderId,
        amount,
        currency,
        key,
        transactionId,
      });
    } catch (err) {
      console.error(err);
      toast.error("Unable to start payment");
    }
  };

  const [libraryPolicy, setLibraryPolicy] = useState(null);

  const fetchLibraryPolicy = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/library/policy`, {
        withCredentials: true,
      });
 
      setLibraryPolicy(res.data?.data || ""); // default to 5 if not provided
    } catch (err) {
      console.error("Failed to fetch library policy", err);
      setLibraryPolicy(""); // safest fallback
    }
  };

  useEffect(() => {
    fetchLibraryPolicy();
  }, []);

  const openLibraryRazorpay = ({
    razorpayOrderId,
    amount,
    currency,
    key,
    transactionId,
  }) => {
    const options = {
      key,
      amount,
      currency,
      order_id: razorpayOrderId,

      name: "Library Fine Payment",
      description: "Late book return fine",

      handler: async (response) => {
        await verifyLibraryPayment(response, transactionId);
        toast.success("Fine paid successfully");
      },

      theme: { color: "#dc2626" }, // red for fine
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", () => {
      toast.error("Payment failed");
    });

    rzp.open();
  };

  const verifyLibraryPayment = async (response, transactionId) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    const res = await axios.post(
      `${API_URL}/api/v1/library/return/verify  `,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transactionId,
      },
      { withCredentials: true }
    );

    

    // Update UI after payment
    setBookingDetails((prev) => ({
      ...prev,
      fineAmount: 0,
      status: "returned",
    }));
  };

  const normalizeTransaction = (tx) => ({
    id: tx._id,
    qrCode: tx.qrCode,
    issueDate: tx.issueDate ? formatDateTime(tx.issueDate) : "Collect the Book",
    dueDate: tx.dueDate ? formatDateTime(tx.issueDate) : "Invalid-Date",
    dueDateFr: tx.dueDate ? formatDateTime(tx.dueDate) : "Invalid-Date",
    status: tx.transactionStatus,
    book: tx.bookId, // 👈 KEY FIX
    fineAmount: tx.fineAmount,
    paymentStatus: tx.paymentStatus,
  });

  const issueBook = async (book) => {
    try {
      const token = Cookies.get("accessToken");


      const res = await axios.post(
        `${API_URL}/api/v1/library/order`,
        { bookId: book.id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const transaction = res.data.data;
      fetchTransactionDetails(transaction._id);

      // setBookingDetails(booking);
      setBookingSuccess(true);
      setShowIssueModal(false);
      // setIssuedBooks([...issuedBooks, booking]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to issue book");
    } finally{
      fetchLibraryHistory();
    }
  };

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

   

      const res = await axios.get(`${API_URL}/api/v1/library/my/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

    
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
    { id: "all", name: "All Books" }, // default "All Books"
    ...Array.from(new Set(books.map((b) => b.category))).map((cat) => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize first letter
      // optional: you can assign different icons if you want
    })),
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

      

        const res = await axios.get(`${API_URL}/api/v1/library/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const rawBooks = res.data?.data || [];

    

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

  const PolicyItem = ({ label, value, danger }) => (
    <div
      className={`rounded-xl px-4 py-3 border text-sm font-bold ${
        danger
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-indigo-50 border-indigo-200 text-indigo-700"
      }`}
    >
      <div className="text-[10px] uppercase tracking-widest opacity-70 mb-1">
        {label}
      </div>
      <div className="text-lg font-black">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <Navbar
        onMyBooksClick={() => setShowMyBooks(true)}
        myBooksCount={history.length}
        showIssueModal={showIssueModal}
        showMyBooks={showMyBooks}
        bookingSuccess={bookingSuccess}
        bookReceived={bookReceived}
      />

      <Toaster position="top-center" reverseOrder={false} />

      {/* Profile menu side bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/*Banner*/}
      {/* <CollegeInfo /> */}

      {libraryPolicy && (
        <div className="max-w-7xl mx-auto px-4 mt-4 ">
          {/* Container with a subtle "Glass & Steel" aesthetic */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Top Thin Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-200" />

            <div className="flex flex-col md:flex-row items-center sm:gap-8 sm:p-6 p-4 gap-4">
              {/* Section Label: Minimalist & Academic */}
              <div className="flex-shrink-0 md:border-r md:border-slate-100 md:pr-10">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Regulatory Framework
                  </h3>
                </div>
                <h2 className="text-md sm:text-xl font-bold text-slate-900 tracking-tight flex items-center justify-center ">
                  Circulation Policy
                </h2>
                <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase flex items-center justify-center">
                  Revised:{" "}
                  {new Date(libraryPolicy.updatedAt).toLocaleDateString(
                    "en-GB",
                    { month: "short", year: "numeric" }
                  )}
                </p>
              </div>

              {/* Policy Data Grid: Professional Metrics */}
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {[
                  {
                    label: "Lending Limit",
                    value: `${libraryPolicy.maxBooksAllowed} Volumes`,
                    icon: <BookOpen className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "Standard Term",
                    value: `${libraryPolicy.returnPeriodDays} Calendar Days`,
                    icon: <Clock className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "Overdue Rate",
                    value: `₹${libraryPolicy.finePerDay} / Per Day`,
                    icon: <AlertCircle className="w-3.5 h-3.5" />,
                    danger: true,
                  },
                  {
                    label: "Liability Cap",
                    value: `₹${libraryPolicy.maxFine} Maximum`,
                    icon: <ShieldCheck className="w-3.5 h-3.5" />,
                    danger: true,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`${
                          item.danger ? "text-rose-500" : "text-blue-500"
                        } opacity-70`}
                      >
                        {item.icon}
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {item.label}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-black tracking-tight ${
                        item.danger ? "text-rose-600" : "text-slate-800"
                      }`}
                    >
                      {item.value}
                    </p>
                    {/* Vertical Divider for Desktop */}
                    {idx !== 3 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-px bg-slate-100" />
                    )}
                  </div>
                ))}
              </div>

              {/* Help Action */}
              <div className="hidden xl:block">
                <button className="text-[10px] font-bold text-slate-400 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-tight">
                  Full Terms
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                Due: {bookingDetails?.dueDateFr}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {bookingSuccess && !bookReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 z-1000">
          <div className="bg-white shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-xl custom-scrollbar">
            <div
              className={`text-white px-6 py-2 font-bold ${
                bookingDetails?.paymentStatus === "pending"
                  ? "bg-red-600"
                  : bookingDetails?.status === "pending"
                  ? "bg-blue-700"
                  : bookingDetails?.status === "issued"
                  ? "bg-green-600"
                  : bookingDetails?.status === "returned"
                  ? "bg-emerald-600"
                  : "bg-gray-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {bookingDetails?.status === "pending"
                    ? "Booking Confirmed!"
                    : bookingDetails?.status === "issued"
                    ? "Issued Book"
                    : bookingDetails?.status === "returned"
                    ? "Returned Book"
                    : ""}
                </h2>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-indigo-100 text-xs sm:text-md mt-1">
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
                        ISBN: {bookingDetails?.book.isbn?.slice(-4) || "7432"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Issue Date:</span>
                    <span
                      className={`font-semibold ${
                        bookingDetails?.issueDate === "Collect the Book"
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    >
                      {bookingDetails?.issueDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due Date:</span>
                    <span
                      className={`font-semibold ${
                        bookingDetails?.issueDate === "Collect the Book"
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    >
                      {bookingDetails?.dueDateFr}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Status:</span>
                    <span
                      className={`font-semibold ${
                        bookingDetails?.status === "pending"
                          ? "text-red-600"
                          : bookingDetails?.status === "issued"
                          ? "text-blue-600"
                          : bookingDetails?.status === "returned"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {bookingDetails?.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 mt-4">
                    {/* --- REMAINING FINE (RED ALERT BOX) --- */}
                    {["pending", "paid"].includes(
                      bookingDetails?.paymentStatus
                    ) && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className=" justify-between items-center px-5 py-4 bg-red-50/50 backdrop-blur-sm border border-red-100 flex flex-col gap-2 rounded-[1.5rem]"
                        >
                          <div className="flex  w-full justify-between items-center px-5 py-1 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-[1.5rem]">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                              </div>
                              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">
                                Remaining Fine
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-red-600">
                              <span className="text-xs font-bold opacity-60">
                                ₹
                              </span>
                              <span className="text-xl font-black tracking-tighter">
                                {bookingDetails?.paymentStatus === "paid" && 0}
                                {bookingDetails?.paymentStatus !== "paid" &&
                                  bookingDetails.fineAmount}
                              </span>
                            </div>
                          </div>

                          <div className="flex w-full justify-between items-center px-5 py-1 bg-green-50/50 backdrop-blur-sm border border-green-100 rounded-[1.5rem]">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                              </div>
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">
                                Paid Amount
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-green-600">
                              <span className="text-xs font-bold opacity-60">
                                ₹
                              </span>
                              <span className="text-xl font-black tracking-tighter">
                                {bookingDetails?.paymentStatus !== "paid" && 0}
                                {bookingDetails?.paymentStatus === "paid" &&
                                  bookingDetails.fineAmount}
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        {/* --- NEW MODERN PAY BUTTON --- */}

                        {bookingDetails?.paymentStatus === "pending" &&
                          bookingDetails?.fineAmount > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                startLibraryFinePayment(bookingDetails?.id)
                              }
                              className="w-full py-4 bg-red-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-colors group"
                            >
                              <div className="bg-white/40 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                                <CheckCircle
                                  size={18}
                                  className="text-emerald-400"
                                />
                              </div>
                              <span className="text-xs font-black uppercase tracking-[0.2em]">
                                Pay Outstanding Fine
                              </span>
                              <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                              />
                            </motion.button>
                          )}
                      </>
                    )}

                    {/* --- PAID FINE (EMERALD SUCCESS) --- */}
                    {bookingDetails?.paymentStatus === "pending" &&
                      bookingDetails.paidAmount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between items-center px-5 py-4 bg-emerald-50/50 backdrop-blur-sm border border-emerald-100 rounded-[1.5rem]"
                        >
                          <div className="flex items-center gap-3 text-emerald-700">
                            <CheckCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                              Paid Amount
                            </span>
                          </div>
                          <div className="text-emerald-700">
                            <span className="text-xs font-bold opacity-60 mr-1">
                              ₹
                            </span>
                            <span className="text-xl font-black tracking-tighter">
                              {bookingDetails.paidAmount}
                            </span>
                          </div>
                        </motion.div>
                      )}
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
                  <strong>Note:</strong> Books must be returned within {libraryPolicy.returnPeriodDays} days.
                  Late returns may result in fines.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Books Sidebar */}
     {showMyBooks && (
  <div className="fixed inset-0 z-[250] bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
    {/* RIGHT SLIDE PANEL */}
    <div
      className="
        absolute right-0 top-0 h-full w-full max-w-md
        bg-white/95 backdrop-blur-xl
        shadow-[-20px_0_50px_rgba(0,0,0,0.12)]
        flex flex-col
        animate-in slide-in-from-right duration-500
      "
    >
      {/* ================= HEADER ================= */}
      <div className="bg-blue-600 px-4 py-4 md:px-8 md:py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-white">
              My Books
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              <p className="text-[10px] md:text-xs font-bold text-blue-100 uppercase tracking-widest">
                {history.length} active sessions
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMyBooks(false)}
            className="
              bg-white/90 text-slate-600
              hover:bg-slate-900 hover:text-white
              rounded-full p-2 md:p-3
              transition-all
            "
          >
            <X className="w-4 h-4 md:w-5 md:h-5 hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 scrollbar-hide">
        {loadingHistory ? (
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">
              Syncing your records…
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">
              Your shelf is empty.
            </p>
          </div>
        ) : (
          history.map((item) => {
            const isPending = item.paymentStatus === "pending";
            const isFined = isPending && item.fineAmount > 0;

            return (
              <div
                key={item._id}
                onClick={() => fetchTransactionDetails(item._id)}
                className={`
                  relative rounded-xl md:rounded-2xl border
                  transition-all duration-300
                  ${
                    isFined
                      ? "bg-rose-100/40 border-rose-200"
                      : "bg-white border-slate-100 md:hover:shadow-xl md:hover:-translate-y-1"
                  }
                `}
              >
                {/* CARD CONTENT */}
                <div className="p-3 md:p-4 flex flex-col gap-3">
                  {/* TOP ROW */}
                  <div className="flex gap-3">
                    {/* COVER */}
                    <div className="relative shrink-0">
                      <img
                        src={item.bookId.coverImage}
                        alt={item.bookId.title}
                        className="w-14 h-20 md:w-16 md:h-22 object-cover rounded-lg shadow ring-1 ring-black/5"
                      />
                      {isFined && (
                        <div className="absolute -top-2 -left-2 bg-rose-500 text-white p-1 rounded-md">
                          <AlertCircle className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                        {item.bookId.title}
                      </h3>

                      <p className="text-[10px] md:text-xs text-slate-400 uppercase italic mt-0.5 tracking-tight">
                        {item.bookId.author}
                      </p>

                      <div className="mt-2">
                        <span
                          className={`
                            inline-block px-2 py-0.5 rounded-md
                            text-[9px] font-black uppercase tracking-widest border
                            ${
                              item.transactionStatus === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : item.transactionStatus === "issued"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                : "bg-indigo-50 text-indigo-600 border-indigo-200"
                            }
                          `}
                        >
                          {item.transactionStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM GRID */}
                  <div
                    className={`
                      grid grid-cols-2 gap-2 p-2 rounded-lg
                      ${isFined ? "bg-rose-100/60" : "bg-slate-50"}
                    `}
                  >
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Issue Date
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Fine
                      </p>
                      <p
                        className={`text-xs font-black ${
                          isFined ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {isFined ? `₹${item.fineAmount}` : "None"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* FINE GLOW */}
                {isFined && (
                  <div className="absolute top-0 right-0 w-24 h-24 -mr-10 -mt-10 bg-rose-500/10 rounded-full blur-xl" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="bg-blue-500 p-3 md:p-6 text-center border-t border-blue-400">
        <p className="text-[9px] md:text-[10px] text-blue-100 font-bold uppercase tracking-[0.3em]">
          College Library Management
        </p>
      </div>
    </div>
  </div>
)}


      {/* Book Details Modal */}
      {showIssueModal && (
  <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
    <div
      className="
        bg-white
        rounded-2xl md:rounded-3xl
        shadow-2xl
        w-full max-w-3xl
        max-h-[95vh] md:max-h-[90vh]
        overflow-hidden
        flex flex-col md:flex-row
        ring-1 ring-black/5
      "
    >
      {/* LEFT PANEL */}
      <div
        className="
          md:w-5/12
          bg-slate-50
          p-2 sm:p-6 md:p-8
          flex flex-col items-center justify-center
          border-b md:border-b-0 md:border-r border-slate-100
        "
      >

        <button
          onClick={() => {
            setShowIssueModal(false);
            setSelectedBook(null);
          }}
          className="sm:hidden absolute top-7 right-4 md:top-6 md:right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>


        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
          <img
            src={selectedBook.coverImage}
            alt={selectedBook.title}
            className="
              relative
              w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64
              object-cover
              rounded-xl md:rounded-2xl
              shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            "
          />
        </div>

        <div className="mt-4 md:mt-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-700">
              {selectedBook.rating}
            </span>
          </div>

          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Reference ID
          </p>
          <p className="text-xs font-mono text-slate-600">
            #{selectedBook.isbn?.slice(-6) || "N/A"}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="
          md:w-7/12
          p-4 sm:p-6 md:p-8
          flex flex-col
          relative
          overflow-y-auto
        "
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setShowIssueModal(false);
            setSelectedBook(null);
          }}
          className="hidden sm:block absolute top-3 right-3 md:top-6 md:right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-4 md:mb-6 pr-8">
          <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
            Educational Resource
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
            {selectedBook.title}
          </h2>
          <p className="text-sm md:text-lg font-medium text-slate-500">
            By {selectedBook.author}
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-5 flex-1">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 md:py-6">
            {[
              ["Status", selectedBook.available > 0 ? "Available" : "Out of Stock"],
              ["Shelf", selectedBook.shelf],
              ["Issue Duration", "14 Days"],
              ["Total Stock", `${selectedBook.total} Copies`],
            ].map(([label, value], i) => (
              <div key={i}>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-sm font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Description
            </p>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-5">
              {selectedBook.description}
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-6">
          <button
            onClick={() => issueBook(selectedBook)}
            disabled={selectedBook.available === 0}
            className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-lg ${
              selectedBook.available > 0
                ? "bg-slate-900 text-white hover:bg-indigo-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            {selectedBook.available > 0
              ? "CONFIRM DIGITAL ISSUE"
              : "CURRENTLY UNAVAILABLE"}
          </button>

          <p className="text-center text-[9px] text-slate-400 mt-3 uppercase tracking-tight">
            By confirming, you agree to library terms.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-2 pt-2">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-2">
  {/* TOTAL BOOKS */}
  <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-md md:shadow-lg">
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className="w-9 h-9 md:w-12 md:h-12 bg-indigo-100 rounded-md md:rounded-lg flex items-center justify-center">
        <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-indigo-600" />
      </div>
      <div>
        <div className="text-lg md:text-2xl font-bold text-gray-900">
          {books.length}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600">
          Total Books
        </div>
      </div>
    </div>
  </div>

  {/* AVAILABLE */}
  <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-md md:shadow-lg">
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className="w-9 h-9 md:w-12 md:h-12 bg-green-100 rounded-md md:rounded-lg flex items-center justify-center">
        <Check className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
      </div>
      <div>
        <div className="text-lg md:text-2xl font-bold text-gray-900">
          {books.reduce((sum, book) => sum + book.available, 0)}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600">
          Available
        </div>
      </div>
    </div>
  </div>

  {/* MY ISSUES */}
  <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-md md:shadow-lg">
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className="w-9 h-9 md:w-12 md:h-12 bg-purple-100 rounded-md md:rounded-lg flex items-center justify-center">
        <User className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
      </div>
      <div>
        <div className="text-lg md:text-2xl font-bold text-gray-900">
          {issuedBooks.length}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600">
          My Issues
        </div>
      </div>
    </div>
  </div>

  {/* PENDING */}
  <div className="bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-md md:shadow-lg">
    <div className="flex items-center space-x-2 md:space-x-3">
      <div className="w-9 h-9 md:w-12 md:h-12 bg-yellow-100 rounded-md md:rounded-lg flex items-center justify-center">
        <Clock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
      </div>
      <div>
        <div className="text-lg md:text-2xl font-bold text-gray-900">
          {pendingBooks.length}
        </div>
        <div className="text-[10px] md:text-xs text-gray-600">
          Pending
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Search and Filter */}
        <div className="mb-6 md:mb-8">
  {/* SEARCH */}
  <div className="relative mb-4 md:mb-6">
    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search by title or author..."
      className="
        w-full
        pl-10 md:pl-12
        pr-3 md:pr-4
        py-2.5 md:py-4
        bg-white
        rounded-lg md:rounded-xl
        border-2 border-gray-200
        focus:border-indigo-500
        focus:ring-2 focus:ring-indigo-200
        outline-none transition
        text-sm md:text-base
      "
    />
  </div>

  {/* CATEGORY SCROLLER */}
 <div className="relative mb-4 sm:mb-6 md:mb-8">
  <div
    className="
      flex gap-2 md:gap-4
      overflow-x-auto
      pb-2 md:pb-3
      px-2 md:px-2
      no-scrollbar
      scroll-smooth
    "
  >
    {categories.map((category) => {
      const isActive = selectedCategory === category.id;

      return (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`
            relative flex items-center gap-2 md:gap-3
            px-3 md:px-5
            py-2 md:py-2.5
            min-h-[36px] md:min-h-0
            rounded-lg md:rounded-xl
            transition-all duration-300
            whitespace-nowrap
            text-[11px] md:text-[11px]
            ${
              isActive
                ? "bg-blue-900 text-white shadow-lg shadow-slate-200"
                : "bg-white text-slate-500 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm"
            }
          `}
        >
          {/* Icon */}
          <span
            className={`transition-transform duration-300 text-xs md:text-sm ${
              isActive ? "scale-110 text-blue-300" : ""
            }`}
          >
            {category.icon}
          </span>

          {/* Label */}
          <span className="font-black uppercase tracking-[0.12em]">
            {category.name}
          </span>

          {/* Active Indicator */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 md:h-4 w-1 bg-blue-500 rounded-r-full" />
          )}
        </button>
      );
    })}
  </div>

  {/* Fade effect — DESKTOP ONLY */}
  <div className="hidden md:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#fcfcfd] to-transparent pointer-events-none" />
</div>


  {/* Scrollbar Hider */}
  <style>{`
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 p-2 md:p-4">
  {filteredBooks.map((book) => (
    <div
      key={book.id}
      className="
        group relative
        flex flex-row md:flex-col
        bg-white border border-slate-200
        rounded-xl md:rounded-2xl
        h-[140px] md:h-auto
        overflow-hidden
        transition-all duration-300
        md:hover:border-indigo-500
        md:hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
      "
    >
      {/* IMAGE SECTION */}
      <div
        className="
          relative
          w-28 h-[140px]
          md:w-full md:h-44
          flex-shrink-0
          overflow-hidden
          bg-slate-100
        "
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="
            w-full h-[140px] object-cover
            md:transition-transform md:duration-500 md:group-hover:scale-110
          "
        />

        {/* Status Badge */}
        <div className="absolute top-1 left-1 md:top-4 md:left-4">
          <span
            className={`px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[11px] font-bold uppercase rounded-md bg-white/90 ${
              book.available > 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {book.available > 0 ? "● Available" : "● Issued"}
          </span>
        </div>

        {/* Rating (keep it) */}
        <div className="absolute bottom-1 left-1 md:bottom-4 md:left-4 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded text-white">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-bold">{book.rating}</span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-1 p-3 md:p-6 flex flex-col">
        {/* Meta */}
        <div className="text-[9px] md:text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
          Section {book.shelf}
        </div>

        {/* Title */}
        <h3
  className="
    text-sm md:text-xl
    font-bold text-slate-800
    leading-tight
    line-clamp-2
    overflow-hidden
    md:group-hover:text-indigo-600
  "
>
  {book.title}
</h3>


        {/* Author */}
        <p className="text-[11px] md:text-sm font-medium text-slate-500 mb-2">
          By {book.author}
        </p>

        {/* Description (still visible on mobile, but compact) */}
       <p
  className="hidden sm:block
    text-[11px] md:text-sm
    text-slate-600
    line-clamp-2
    overflow-hidden
    max-h-[32px] md:max-h-none
  "
>
  {book.description}
</p>


        {/* FOOTER */}
        <div className="mt-auto pt-2 md:pt-6 border-t border-slate-100 flex items-center justify-between shrink-0">
          {/* Stats */}
          <div className="flex items-center gap-3 text-[10px] md:text-sm font-bold text-slate-700">
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
                        {libraryPolicy?.returnPeriodDays}
                      </span>
                    </div>
          </div>

          {/* Action */}
          <button
            onClick={() => {
              setSelectedBook(book);
              setShowIssueModal(true);
            }}
            disabled={book.available === 0}
            className={`p-2 md:w-12 md:h-12 rounded-lg  md:rounded-xl transition-all ${
              book.available > 0
                ? "bg-slate-900 text-white md:hover:bg-indigo-600 md:hover:rotate-12"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <QrCode className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>

      <Footer/>
    </div>
  );
}
