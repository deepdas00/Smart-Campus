import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // <--- Add this line
import jsQR from "jsqr";
import { useRef } from "react";
import { useMotionValue, useTransform, useDragControls } from "framer-motion";

import {
  Plus,
  BookOpen,
  Upload,
  X,
  PlusCircle,
  Loader2,
  RotateCcw,
  Bell,
  ArrowRight,
  ShieldCheck,
  Library,
  Zap,
  CheckCircle,
  AlertTriangle,
  Folder,
  ArrowLeft,
  Edit3,
  Trash2,
  BookMarked,
  Keyboard as KeyboardIcon,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer";
// import CollegeInfo from "../Components/CollegeInfo";
import LibraryHeader from "../Components/LibraryHeader";
import LibrarySidebar from "../Components/LibrarySidebar";
import StatsGrid from "../Components/StatsGrid";
import TransactionsTable from "../Components/TransactionsTable";

export default function LibraryTeacherHandle() {
  const [isReturnMode, setIsReturnMode] = useState(false);
  const [returnData, setReturnData] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returning, setReturning] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
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
  // 🔹 QR + Delivery states
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedTransaction, setScannedTransaction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const normalizeTransaction = (tx) => ({
    id: tx._id,
    student: tx.studentId?.fullName || "Unknown",
    roll: tx.studentId?.rollNo || "-",
    email: tx.studentId?.email || "__",
    book: tx.bookId?.title || "Unknown",
    coverImage: tx.bookId?.coverImage || null, // ✅ ADD THIS
    author: tx.bookId?.author || "", // optional

    date: new Date(tx.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    status: tx.transactionStatus,
  });

  const handleNotifyReturnReminders = async () => {
    try {
      setNotifying(true);

      const res = await axios.get(
        `${API_URL}/api/v1/library/notify-return-reminders`,
        {
          withCredentials: true,
        }
      );

      const count = res.data?.data?.notifiedCount || 0;

      toast(`✅ ${count}(s) reminder emails sent to  student`);
    } catch (error) {
      console.error(error);
      toast("❌ Failed to send return reminders");
    } finally {
      setNotifying(false);
    }
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isDragging = useRef(false);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [issuing, setIssuing] = useState(false);

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

  const [scannedBook, setScannedBook] = useState(null);

  const [showReturnSuccess, setShowReturnSuccess] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode();
      }
    } catch (err) {
      console.error("Camera access denied", err);
      toast.error("Camera permission required");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };

  const scanQRCode = () => {
    // We use a local variable to track if the component is still mounted
    let isScanning = true;

    const scan = () => {
      if (!isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Safety check: Ensure elements exist and video is playing
      if (video?.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            isScanning = false; // Stop the local loop
            stopCamera();
            handleQRResult(code.data);
            return; // Exit the loop
          }
        } catch (err) {
          console.error("Internal scanning error:", err);
        }
      }

      // Use requestAnimationFrame for the next frame
      requestAnimationFrame(scan);
    };

    scan();

    // Return a cleanup function for the useEffect
    return () => {
      isScanning = false;
    };
  };

  const handleQRResult = (qrData) => {
    try {
      // Parse the QR JSON
      const parsed = JSON.parse(qrData);

      // Check if transactionId exists
      if (!parsed.transactionId) {
        toast.error("Invalid QR code");
        return;
      }

      // Extract only transactionId
      const transactionId = parsed.transactionId;

      if (isReturnMode) {
        fetchReturnDetails(transactionId);
      } else {
        fetchBookDetails(transactionId); // existing issue flow
      }
    } catch (err) {
      console.error(err);
      toast.error("Invalid QR format");
    } finally {
      toast.success("QR Detected ✔");
      setShowQRScanner(false);
    }
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const token = Cookies.get("accessToken");
      const res = await axios.get(
        `${API_URL}/api/v1/library/transactions/${bookId}`,
        { withCredentials: true }
      );

      setScannedBook(res.data.data);

      setShowConfirmIssue(true);
    } catch (err) {
      toast.error("Book not found or unavailable");
    }
  };

  const fetchReturnDetails = async (transactionId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/v1/library/return/finalize/${transactionId}`,
        { withCredentials: true }
      );

      console.log(res.data.data);
      

      setReturnData(res.data.data);
      setShowReturnModal(true); // 🔥 THIS IS REQUIRED
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid return request");
    }
  };

  //   useEffect(() => {
  //   if (scannedBook) {
  //     handleIssueScannedBook();
  //   }
  // }, [scannedBook]);

  const [showConfirmIssue, setShowConfirmIssue] = useState(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleIssueScannedBook = async () => {
    if (!scannedBook) return;

    try {
      setIssuing(true);
      setIsProcessing(true);

      const token = Cookies.get("accessToken");
      await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/library/issue/${
          scannedBook._id
        }`,
        // Replace with actual student info
        { withCredentials: true }
      );

      setShowSuccessModal(true);
      toast.success("Book issued successfully!");
      setShowConfirmIssue(false);
      setScannedBook(null);

      setTimeout(() => setShowSuccessModal(false), 3580);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to issue book");
    } finally {
      setIsProcessing(false);
    }
  };

  const stopDrag = () => {
    isDragging.current = false;
    if (swipeProgress < 95) setSwipeProgress(0);
  };

  useEffect(() => {
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [swipeProgress]);

  const handleReturnConfirm = async () => {
    try {
      setReturning(true);

      await axios.post(
        `${API_URL}/api/v1/library/return`,
        {
          transactionId: returnData._id,
        },
        { withCredentials: true }
      );

      // ✅ Close confirm modal
      setShowReturnModal(false);

      // ✅ Show success modal
      setShowReturnSuccess(true);

      toast.success("Book returned successfully");

      // Reset states
      setReturnData(null);
      setIsReturnMode(false);

      // Auto close success window
      setTimeout(() => {
        setShowReturnSuccess(false);
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Return failed");
    } finally {
      setReturning(false);
      setShowReturnModal(false);
    }
  };

  const closeReturnFlow = () => {
    setShowReturnModal(false);
    setReturnData(null);
    setIsReturnMode(false);
  };

  useEffect(() => {
    if (showQRScanner) startCamera();
    return stopCamera;
  }, [showQRScanner]);

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
      toast("Please fill all fields.");
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

      const formData = new FormData();

      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("category", newBook.category);
      formData.append("totalCopies", Number(newBook.totalCopies));
      formData.append("availableCopies", Number(newBook.availableCopies));
      formData.append("shelf", newBook.shelf);
      formData.append("rating", Number(newBook.rating));
      formData.append("isbn", newBook.isbn);
      formData.append("publisher", newBook.publisher);
      formData.append("publishedYear", Number(newBook.publishedYear));
      formData.append("description", newBook.description);

      if (newBook.coverImage) {
        formData.append("coverImage", newBook.coverImage);
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/library/books/${
          editingBook._id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❗ Do NOT set Content-Type manually
          },
          withCredentials: true,
        }
      );

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

  const handleMouseMove = (e) => {
    if (!dragging.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const newProgress = Math.min(
      100,
      Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
    );

    setProgress(newProgress);

    if (newProgress >= 98) {
      dragging.current = false;
      onConfirm();
      setProgress(100);
    }
  };

  const SwipeToConfirm = ({ onConfirm, loading = false }) => {
    const [progress, setProgress] = useState(0);
    const dragging = useRef(false);

    const handleMouseDown = () => {
      if (loading) return;
      dragging.current = true;
    };

    const handleMouseMove = (e) => {
      if (!dragging.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const newProgress = Math.min(
        100,
        Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)
      );

      setProgress(newProgress);

      if (newProgress >= 98) {
        dragging.current = false;
        onConfirm();
        setProgress(100);
      }
    };

    const handleMouseUp = () => {
      dragging.current = false;
      if (progress < 98) setProgress(0);
    };

    return (
      <div
        className="relative mt-4 h-14 rounded-full bg-gray-200 overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Progress */}
        <div
          className="absolute inset-y-0 left-0 bg-green-500 transition-all"
          style={{ width: `${progress}%` }}
        />

        {/* Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-1 left-1 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer z-10"
          style={{ transform: `translateX(${progress * 2.6}px)` }}
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          ) : (
            <ArrowRight />
          )}
        </div>

        {/* Label */}
        <span className="absolute inset-0 flex items-center justify-center font-medium text-gray-600">
          Swipe to Confirm Return
        </span>
      </div>
    );
  };

  const LuxeSwipeButton = ({ onConfirm, loading }) => {
    // 1. Motion Value tracks the exact X position without triggering React re-renders
    const x = useMotionValue(0);

    // 2. High-performance transforms (GPU Accelerated)
    // Maps X position (0 to 220px) to colors and opacity
    const trackBg = useTransform(
      x,
      [0, 180],
      ["rgba(241, 245, 249, 0.5)", "rgba(16, 185, 129, 1)"]
    );
    const textOpacity = useTransform(x, [0, 100], [1, 0]);
    const iconColor = useTransform(x, [150, 180], ["#0f172a", "#ffffff"]);

    return (
      <div className="relative w-full h-20 bg-slate-200/50 backdrop-blur-sm rounded-[2.2rem] p-2 border-2 border-white/50 overflow-hidden shadow-inner">
        {/* The Dynamic Progress Fill */}
        <motion.div
          style={{ x, background: trackBg, width: "100%" }}
          className="absolute inset-0 z-0 origin-left"
        />

        {/* Instructional Text */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            Slide to Confirm
          </span>
        </motion.div>

        {/* The Draggable Handle */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 235 }} // Constraints prevent it from sliding out of the track
          dragElastic={0.05}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={(e, info) => {
            // If swiped more than 180px, trigger success
            if (info.offset.x > 180) {
              onConfirm();
            }
            // The handle automatically snaps back because we aren't updating 'x' state manually
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }} // Ultra-snappy spring
          className="relative z-10 w-16 h-16 bg-white rounded-[1.6rem] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing border border-slate-100"
        >
          {loading ? (
            <Loader2 className="text-emerald-500 animate-spin" size={24} />
          ) : (
            <motion.div style={{ color: iconColor }}>
              <ArrowRight size={26} strokeWidth={3} />
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="">
        {/* <CollegeInfo /> */}
        <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans text-slate-900 ">
          {/* --- TOP NAVIGATION BAR --- */}

          <LibraryHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          >
            <div className="flex flex-row gap-3">
              {/* SCAN & ISSUE BUTTON */}
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQRScanner(true)}
                className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 overflow-hidden"
              >
                <div className="p-2 bg-white/20 rounded-xl">
                  <PlusCircle size={18} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black tracking-tight whitespace-nowrap">
                  Issue Book
                </span>
              </motion.button>

              {/* SCAN & RETURN BUTTON */}
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsReturnMode(true);
                  setShowQRScanner(true);
                }}
                className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl shadow-lg shadow-indigo-500/20 overflow-hidden"
              >
                <div className="p-2 bg-white/20 rounded-xl">
                  <RotateCcw size={18} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-black tracking-tight whitespace-nowrap">
                  Return Book
                </span>
              </motion.button>
            </div>
          </LibraryHeader>

          <main className="max-w-full mx-auto flex flex-col gap-6">
            {/* --- TOP SECTION (SIDEBAR + STATS) --- */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              {/* Sidebar */}
              <div className="w-full lg:w-64 shrink-0">
                <LibrarySidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setSelectedDept={setSelectedDept}
                  setShowIssueModal={setShowIssueModal}
                />
              </div>

              {/* Stats */}
              <div className="w-full flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                  <StatsGrid stats={stats} />
                </div>
              </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="space-y-6">
              <div className="bg-white rounded-[1rem] sm:rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden min-h-[400px]">
                {/* HEADER */}
                <div className="px-2 sm:px-6 lg:px-8 py-4 border-b border-slate-100 flex flex-wrap gap-3 sm:justify-between justify-center items-center bg-blue-200">
                  <div className="flex items-center gap-2">
                    {selectedDept && (
                      <ArrowLeft
                        size={20}
                        className="cursor-pointer text-slate-400"
                        onClick={() => setSelectedDept(null)}
                      />
                    )}

                    <h3 className="font-black text-slate-800 uppercase tracking-tight text-base  sm:text-lg">
                      {activeTab === "transactions"
                        ? "Active Borrowers"
                        : selectedDept
                        ? `Inventory / ${selectedDept}`
                        : "Department Folders"}
                    </h3>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    {activeTab === "inventory" && !selectedDept && (
                      <button
                        onClick={() => setShowAddBookModal(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                      >
                        <Plus size={14} /> Add New Book
                      </button>
                    )}

                    {activeTab === "transactions" && (
                      <button
                        onClick={handleNotifyReturnReminders}
                        disabled={notifying}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition disabled:bg-slate-400"
                      >
                        {notifying ? (
                          "Sending…"
                        ) : (
                          <>
                            <Bell size={14} /> Notify Students
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                {activeTab === "transactions" ? (
                  loadingTransactions ? (
                    <div className="p-10 text-center font-bold text-slate-400">
                      Loading transactions...
                    </div>
                  ) : transactionError ? (
                    <div className="p-10 text-center text-red-500 font-bold">
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
                        <div className="flex justify-center py-4">
                          <button
                            onClick={() => setVisibleTransactions((p) => p + 5)}
                            className="flex items-center gap-2 px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:border-indigo-600 hover:text-indigo-600 transition active:scale-95"
                          >
                            View More Transactions
                            <svg
                              className="w-4 h-4"
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
                  <div className="p-4 sm:p-6 lg:p-8">
                    {!selectedDept ? (
                      /* DEPARTMENT GRID: Adapts from 1 column (mobile) to 3 columns (laptop) */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
                        {departments.map((dept) => (
                          <div
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className="group p-1 pl-2 sm:p-5 lg:p-6 bg-white border-2 border-slate-100 rounded-[1rem] lg:rounded-[2rem] hover:border-indigo-500 transition-all cursor-pointer flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-0"
                          >
                            {/* Icon Container */}
                            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center lg:mb-4 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
                              <Folder size={24} />
                            </div>

                            {/* Text Container */}
                            <div className="flex flex-col">
                              <h4 className="font-black text-slate-800 text-sm lg:text-lg mb-0 lg:mb-1 leading-tight">
                                {dept}
                              </h4>
                              <p className="text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {
                                  books.filter((b) => b.category === dept)
                                    .length
                                }{" "}
                                Titles
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* BOOK LIST: Preserves laptop row layout, stacks on mobile */
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

                              <div className="flex flex-col lg:flex-row p-5 gap-4 lg:gap-6">
                                {/* Section 1: Visual Identity */}
                                <div className="flex gap-4 shrink-0">
                                  <div className="relative">
                                    <img
                                      src={book.coverImage}
                                      alt={book.title}
                                      className="w-12 sm:w-20 lg:w-20 lg:mt-7 object-cover rounded-lg shadow-sm border border-slate-100 group-hover:rotate-1 transition-transform"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-white shadow-lg border border-slate-100 rounded-lg px-1 sm:px-2 py-1 flex items-center gap-1">
                                      <span className="text-amber-400 text-[9px]">
                                        ★
                                      </span>
                                      <span className="text-[8px] font-bold text-slate-700">
                                        {book.rating}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Title/Author - Visible on Mobile (Hidden on Laptop to use the other title div) */}
                                  <div className="flex flex-col justify-center lg:hidden flex-1 min-w-0">
                                   <div className="flex justify-between w-full ">



                                     <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded-full uppercase tracking-widest mb-1">
                                      {book.category}

                                      
                                    </span>


                                    <div className="flex lg:hidden gap-4">
                                        <button
                                          onClick={() => {
                                            setEditingBook(book);
                                            setNewBook(book);
                                            setShowAddBookModal(true);
                                          }}
                                          className=" bg-slate-50 rounded-lg text-slate-500"
                                        >
                                          <Edit3 size={14} />
                                        </button>
                                        <button
                                          onClick={() => setBookToDelete(book)}
                                          className=" bg-slate-50 rounded-lg text-red-500"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>



                                    </div>
                                    <h4 className="font-bold text-slate-900 sm:text-base leading-tight sm:truncate text[12px]">
                                      {book.title}
                                    </h4>
                                    <p className="text-[8px] sm:text-sm text-indigo-600 font-medium">
                                      {book.author}
                                    </p>
                                  </div>

                                  {/* Mobile Actions: Edit/Delete buttons visible on mobile header */}
                                </div>

                                {/* Section 2: Core Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                  {/* Laptop Title Header - Hidden on Mobile */}
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

                                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => {
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

                                  <p className="text-sm text-slate-500 line-clamp-2 lg:max-w-2xl leading-relaxed">
                                    {book.description}
                                  </p>

                                  {/* Section 3: Professional Data Points */}
                                  <div className="mt-4 grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-y-4 lg:gap-x-8 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <div className="px-1 sm:p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <span className="text-[10px] font-bold uppercase">
                                          Shelf
                                        </span>
                                      </div>
                                      <p className="text-xs font-bold text-slate-700">
                                        {book.shelf}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="px-1 sm:p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <span className="text-[10px] font-black uppercase">
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
                                        <span className="whitespace-nowrap">
                                          {book.availableCopies}/
                                          {book.totalCopies}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center col-span-2 lg:col-auto lg:ml-auto border-t lg:border-t-0 pt-2 lg:pt-0">
                                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded lg:bg-transparent">
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
  <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-in fade-in zoom-in duration-300 z-[110]">
    {/* Main Container: Changed rounded-[3.5rem] to rounded-3xl on mobile for better fit */}
    <div className="bg-white rounded-3xl md:rounded-[3.5rem] w-full max-w-4xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 flex flex-col md:flex-row h-[90vh] md:min-h-[650px] md:h-auto">
      
      {/* LEFT ACCENT PANEL: Responsive padding and layout */}
      <div className="md:w-72 bg-gradient-to-b from-blue-600 via-blue-900 to-black p-4 md:p-10 flex flex-row md:flex-col justify-between text-white relative shrink-0">
        {/* Animated Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_50%)] animate-pulse"></div>
        </div>

        <div className="relative z-10 flex  gap-5 sm:flex-col">
          <div className="w-8 h-8 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-xl md:rounded-[1.5rem] flex items-center justify-center mb-4 md:mb-8 border border-white/30 shadow-xl">
            <BookOpen size={20} className="md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl md:text-4xl font-black leading-tight md:leading-[0.9] tracking-tighter italic">
            {isEditMode ? (
              <>UPDATE <br className="hidden md:block"/> BOOK</>
            ) : (
              <>ADD <br className="hidden md:block"/> NEW BOOK</>
            )}
          </h3>

          
          <div className="hidden md:block h-1 w-12 bg-indigo-300 mt-6 rounded-full"></div>





          <button
            onClick={() => {
              setShowAddBookModal(false);
              handleCloseModal();
            }}
            className="sm:hidden p-2 relative -right-15 -top-2 md:p-3  text-slate-400 hover:text-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 rounded-xl md:rounded-2xl transition-all duration-300 active:scale-90"
          >
            <X size={20} md:size={20} strokeWidth={3} />
          </button>





        </div>

        {/* This part hides on small mobile to save space, visible on tablet/laptop */}
        <div className="relative z-10 hidden sm:flex flex-col">
          <div className="space-y-4">
            <div className="flex items-center gap-3 opacity-100">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Live Registry
              </span>
            </div>
            <p className="hidden md:block text-indigo-100/60 text-[10px] leading-relaxed font-medium">
              Ensure all mandatory fields are verified before authorizing the database entry.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL: Interactive Form */}
      <div className="flex-1 bg-[#f8fafc] flex flex-col relative overflow-hidden">
        {/* Elegant Close Button - Adjusted position for mobile */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
          <button
            onClick={() => {
              setShowAddBookModal(false);
              handleCloseModal();
            }}
            className="hidden sm:block p-2 md:p-3 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-2xl hover:shadow-indigo-100 rounded-xl md:rounded-2xl transition-all duration-300 active:scale-90 border border-slate-100"
          >
            <X size={18} md:size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Scrollable Container - Increased padding responsiveness */}
        <div className="px-3 sm:px-6 md:px-12 pt-10 md:pt-16 pb-6 md:pb-10 space-y-6 md:space-y-10 overflow-y-auto custom-scrollbar flex-1">
          {/* Group 1: Identity */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg">
                01
              </span>
              <h4 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Identity & Origin
              </h4>
            </div>

            <div className="grid gap-4 md:gap-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Official Publication Title *"
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-[1.5rem] px-5 py-4 md:px-8 md:py-5 outline-none transition-all focus:border-indigo-500 font-bold text-slate-700 placeholder:text-slate-300 text-sm md:text-base"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Primary Author *"
                  className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 outline-none transition-all focus:border-indigo-500 font-bold text-slate-700 text-sm"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Department/Category *"
                  className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 outline-none transition-all focus:border-indigo-500 font-bold text-slate-700 text-sm"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Group 2: Quantitative Data */}
          <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg">
                02
              </span>
              <h4 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Logistics & Stock
              </h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { label: "Total", val: newBook.totalCopies, key: "totalCopies", type: "number" },
                { label: "Avail.", val: newBook.availableCopies, key: "availableCopies", type: "number" },
                { label: "Shelf", val: newBook.shelf, key: "shelf", type: "text" },
              ].map((field) => (
                <div key={field.key} className="group flex flex-col">
                  <span className="text-[8px] md:text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-2 mb-1">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 outline-none focus:bg-white focus:border-indigo-500 transition-all font-black text-slate-700 text-xs md:text-sm"
                    value={field.val}
                    onChange={(e) => {
                      /* ... your existing logic remains exactly the same ... */
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Remaining fields: Simplified padding/rounded for mobile */}
          <div className="space-y-4">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
               <input type="number" placeholder="Rating" className="bg-slate-100/50 rounded-xl px-4 py-3 text-sm font-bold" />
               <input type="text" placeholder="ISBN" className="bg-slate-100/50 rounded-xl px-4 py-3 text-sm font-bold col-span-1" />
               <input type="number" placeholder="Year" className="bg-slate-100/50 rounded-xl px-4 py-3 text-sm font-bold col-span-2 md:col-span-1" />
             </div>
             <textarea
               placeholder="Description..."
               rows={2}
               className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-[2rem] px-5 py-4 outline-none text-sm"
             />
          </div>
        </div>

        {/* Action Footer: Made sticky/bottom for easier access on mobile */}
        <div className="p-4 md:p-10 bg-black border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="hidden sm:block">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
              Auth: Librarian
            </span>
          </div>
          <button
            onClick={() => { /* ... existing logic ... */ }}
            className={`w-full sm:w-auto px-10 md:px-14 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all ${
              isEditMode ? "bg-emerald-600" : "bg-[#30299c] text-white"
            }`}
          >
            {isEditMode ? "Update Book" : "Register Entry"}
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
                    onClick={() => {
                      setShowIssueModal(false);
                    }}
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

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-[360px] text-center space-y-6">
              <BookMarked size={48} className="mx-auto text-indigo-600" />

              <h3 className="font-black text-lg">Confirm Book Delivery</h3>
              <p className="text-sm text-slate-500">
                {scannedTransaction?.bookId?.title}
              </p>

              <div
                id="swipe-track"
                onMouseDown={() => (isDragging.current = true)}
                className="relative h-14 bg-slate-200 rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-emerald-500 transition-all"
                  style={{ width: `${swipeProgress}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                  Swipe to Deliver →
                </span>
              </div>
            </div>
          </div>
        )}

        {showQRScanner && (
          <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-lg flex items-center justify-center">
            {/* Close */}

            {/* Main Scanner Card */}
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 w-[320px] shadow-2xl">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-green-400 text-xs font-semibold tracking-widest uppercase">
                  Library Scanner
                </h2>
                <p className="text-white text-lg font-medium">
                  Scan Book Barcode
                </p>
              </div>

              <button
                onClick={() => {
                  setShowQRScanner(false);
                  stopCamera();
                }}
                className="absolute top-5 right-5 z-[200] bg-white/10 hover:bg-red-500/20 text-white p-2 rounded-full transition"
              >
                <X size={20} />
              </button>

              {/* Camera Area */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scan Frame */}
                <div className="absolute inset-6 border-2 border-green-400/60 rounded-xl">
                  {/* Scan Line */}
                  <div className="absolute left-0 right-0 h-[2px] bg-green-400 animate-scan-soft" />

                  {/* Corners */}
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-l-4 border-t-4 border-green-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-r-4 border-t-4 border-green-400" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-l-4 border-b-4 border-green-400" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-r-4 border-b-4 border-green-400" />
                </div>
              </div>

              {/* Hint */}
              <p className="mt-4 text-center text-sm text-slate-300">
                Place the{" "}
                <span className="text-green-400 font-medium">barcode</span>{" "}
                inside the frame
              </p>

              {/* Bottom Actions */}
              <div className="flex justify-center gap-6 mt-5">
                <button className="flex items-center gap-2 text-slate-300 hover:text-white text-sm">
                  <Zap size={16} />
                  Flash
                </button>
                <button className="flex items-center gap-2 text-slate-300 hover:text-white text-sm">
                  <KeyboardIcon size={16} />
                  Manual
                </button>
              </div>
            </div>
          </div>
        )}

       {showConfirmIssue && scannedBook && (
  <div className="fixed inset-0 z-[150] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
    >
      {/* 1. Header & Floating Book Cover Detail */}
      <div className="h-28 md:h-32 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative flex items-center px-6 md:px-8">
        <div className="flex flex-col">
          <h2 className="text-white text-xl md:text-2xl font-black tracking-tight leading-none mb-1">
            Confirm Issue
          </h2>
          <p className="text-indigo-100/70 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
            Transaction Protocol
          </p>
        </div>

        {/* THE FLOATING BOOK IMAGE - Scaled down for mobile */}
        <div className="absolute -bottom-6 right-6 md:-bottom-8 md:right-8 z-20">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
          >
            <img
              src={scannedBook.bookId?.coverImage || scannedBook.bookId?.image || "https://via.placeholder.com/150"}
              alt="Book Cover"
              className="w-16 h-24 md:w-24 md:h-36 object-cover rounded-xl md:rounded-2xl shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-all duration-500"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 md:p-1.5 rounded-full shadow-lg border-2 border-white">
              <CheckCircle size={14} className="md:w-4 md:h-4" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 md:px-8 pt-10 md:pt-12 pb-6 md:pb-8">
        {/* 2. Info Cards (Student & Book Details) */}
        <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
          
          {/* Student "Identity Card" */}
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm">
            <div className="h-12 w-12 md:h-16 md:w-16 bg-indigo-100 rounded-xl md:rounded-2xl overflow-hidden shadow-md border-2 border-white shrink-0">
              {scannedBook.studentId?.profilePhoto ? (
                <img
                  src={scannedBook.studentId.profilePhoto}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-lg md:text-xl">
                  {scannedBook.studentId.fullName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-widest font-black text-indigo-400 leading-none mb-1">
                Borrower
              </p>
              <h4 className="text-slate-900 font-bold text-sm md:text-base leading-none truncate">
                {scannedBook.studentId.fullName}
              </h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                Roll: {scannedBook.studentId.rollNo}
              </p>
            </div>
          </div>

          {/* Book Information Section */}
          <div className="p-4 md:p-5 bg-indigo-50/30 border border-indigo-100 rounded-[1.2rem] md:rounded-[1.5rem] relative overflow-hidden group">
            <Library
              className="absolute -right-4 -bottom-4 md:-right-6 md:-bottom-6 text-indigo-200/30 transition-transform duration-700"
              size={80} // Smaller for mobile bg
            />
            <div className="relative z-10 pr-12 md:pr-20">
              <p className="text-[9px] uppercase tracking-widest font-black text-slate-400 mb-1">
                Book Details
              </p>
              <h4 className="text-slate-800 font-bold text-xs md:text-sm leading-tight mb-1 line-clamp-1">
                {scannedBook.bookId?.title}
              </h4>
              <p className="text-[10px] md:text-xs text-slate-500 italic mb-3">
                by {scannedBook.bookId?.author}
              </p>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <span className="text-[8px] md:text-[9px] font-black bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-md md:rounded-lg uppercase">
                  Shelf: {scannedBook.bookId?.shelf}
                </span>
                <span className="text-[8px] md:text-[9px] font-black bg-indigo-600 text-white px-2 py-1 rounded-md md:rounded-lg uppercase">
                  ID: {scannedBook.bookId?._id?.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. THE RESPONSIVE SLIDER */}
        <div className="relative h-16 md:h-20 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-full md:rounded-[2.5rem] p-1.5 md:p-2 border-2 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* PROGRESS FILL - Calculates based on swipeProgress state */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-20 pointer-events-none"
            style={{ width: `${(swipeProgress / 280) * 100}%` }}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] animate-pulse">
              Swipe to Authorize
            </span>
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 260 }} // For mobile, you can use a ref to make this dynamic
            dragElastic={0.1}
            dragSnapToOrigin
            onDrag={(e, info) => setSwipeProgress(info.offset.x)}
            onDragEnd={(event, info) => {
              if (info.offset.x > 210) {
                setShowConfirmIssue(false);
                handleIssueScannedBook();
              }
              setSwipeProgress(0);
            }}
            className="z-10 w-12 h-12 md:w-16 md:h-16 bg-indigo-600 rounded-full md:rounded-[1.8rem] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl border-t border-white/30 relative"
          >
            <Zap className="text-white" size={20} md:size={26} fill="currentColor" />
          </motion.div>
        </div>

        {/* 4. FOOTER */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setShowConfirmIssue(false)}
            className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all"
          >
            <X size={14} /> Cancel
          </button>
          <div className="text-right">
            <p className="text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">System Architect</p>
            <p className="text-[9px] md:text-[11px] font-bold text-indigo-500/60 font-mono italic">YourName.Dev</p>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)}

        {/* --- ENGAGING SUCCESS POPUP --- */}
        <AnimatePresence>
          {showSuccessModal && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6"
  >
    <motion.div
      initial={{ scale: 0.5, y: 100, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.5, y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 200 }}
      className="relative bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] max-w-sm w-full text-center overflow-hidden border border-white"
    >
      {/* Animated Background Sunburst - Responsive Blur */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -top-16 -left-16 md:-top-24 md:-left-24 w-32 h-32 md:w-48 md:h-48 bg-indigo-500/10 rounded-full blur-2xl md:blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-16 -right-16 md:-bottom-24 md:-right-24 w-32 h-32 md:w-48 md:h-48 bg-purple-500/10 rounded-full blur-2xl md:blur-3xl"
      />

      {/* Success Icon with Pulse */}
      <div className="relative mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-200"
        >
          <CheckCircle
            size={40}
            className="text-white md:hidden"
            strokeWidth={3}
          />
          <CheckCircle
            size={48}
            className="text-white hidden md:block"
            strokeWidth={3}
          />
        </motion.div>

        {/* Decorative Sparks - Scaled for Mobile */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: (i - 2.5) * (window.innerWidth < 640 ? 30 : 40),
              y: window.innerWidth < 640 ? -50 : -60,
            }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full"
          />
        ))}
      </div>

      {/* Text Content */}
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter mb-2 md:mb-3">
          BOOK ISSUED!
        </h2>
        <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed px-2">
          The transaction was <span className="text-indigo-600 font-bold">authorized</span> successfully. 
          The student can now collect the book.
        </p>

        {/* Engaging Dismiss Button */}
        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          Got it, Thanks!
        </button>
      </div>
    </motion.div>
  </motion.div>
)}
        </AnimatePresence>

        {/* RETURN CONFIRM MODAL */}
        <AnimatePresence>
         {showReturnModal && returnData && (
  <motion.div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 sm:p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="relative bg-white/90 backdrop-blur-2xl w-full max-w-[440px] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white overflow-y-auto max-h-[95vh] md:max-h-none"
      initial={{ scale: 0.8, y: 100, rotateX: 20 }}
      animate={{ scale: 1, y: 0, rotateX: 0 }}
      exit={{ scale: 0.8, y: 50, opacity: 0 }}
      transition={{ type: "spring", damping: 18, stiffness: 120 }}
    >
      {/* Animated Background Orbs - Hidden on very small screens for performance */}
      <div className="hidden sm:block absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
      <div className="hidden sm:block absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />

      {/* Floating Return Icon - Scaled for Mobile */}
      <div className="relative md:mb-8 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl md:rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-slate-300"
        >
          <RotateCcw size={28} className="text-emerald-400 md:hidden" />
          <RotateCcw size={36} className="text-emerald-400 hidden md:block" />
        </motion.div>
      </div>

      {/* Content Header */}
      <div className="text-center space-y-2 mb-2 sm:mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Verify Return
        </h2>
        <div className="h-1.5 w-10 md:w-12 bg-indigo-600 mx-auto rounded-full" />
      </div>

      {/* Details Card (Modern Glass) - Responsive Spacing */}
      <div className="bg-slate-50/50 rounded-2xl md:rounded-[2rem] p-2 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-white/50 space-y-3 md:space-y-4">
        <div className="flex flex-row items-center justify-between flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Student
          </span>
          <span className="text-sm font-bold text-slate-800">
            {returnData.studentId.fullName}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-t border-slate-100 pt-3 gap-1 sm:gap-4">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest sm:mt-1">
            Book Title
          </span>
          <span className="text-sm font-bold text-indigo-600 sm:text-right max-w-full sm:max-w-[200px] leading-tight break-words">
            {returnData.bookId.title}
          </span>
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            TX Code
          </span>
          <span className="text-xs md:text-sm font-mono font-bold text-indigo-600">
            #{returnData.transactionCode}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Shelf
          </span>
          <span className="text-xs md:text-sm font-mono font-bold text-indigo-600">
            #{returnData?.bookId?.shelf}
          </span>
        </div>

        <div className="flex flex-row justify-between items-center sm:flex-row sm:justify-between sm:items-center border-t border-slate-100 pt-3 gap-1 sm:gap-0">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Issue Date
          </span>
          <span className="text-[11px] md:text-sm font-bold text-slate-800">
            {new Date(returnData.issueDate).toLocaleDateString([], { dateStyle: 'medium' })}
          </span>
        </div>
        <div className="flex flex-row justify-between items-center sm:flex-row sm:justify-between sm:items-center border-t border-slate-100 pt-3 gap-1 sm:gap-0">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Return Date
          </span>
          <span className="text-[11px] md:text-sm font-bold text-slate-800">
            {new Date(returnData.dueDate).toLocaleDateString([], { dateStyle: 'medium' })}
          </span>
        </div>
      </div>

      {/* Swipe Component */}
      <div className="px-0 sm:px-2">
        <LuxeSwipeButton
          onConfirm={handleReturnConfirm}
          loading={returning}
        />
      </div>

      {/* Minimalist Cancel Link */}
      <button
        onClick={() => {
          setShowReturnModal(false);
          setReturnData(null);
          setIsReturnMode(false);
        }}
        className="mt-6 md:mt-8 w-full text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] hover:text-red-500 transition-all active:scale-95"
      >
        Dismiss Action
      </button>
    </motion.div>
  </motion.div>
)}
        </AnimatePresence>

        {/*SUCESS AFTER SUCEESFULLY RETURN */}

        <AnimatePresence>
         {showReturnSuccess && (
  <motion.div
    className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 w-full max-w-[380px] text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white relative overflow-hidden"
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 150 }}
    >
      {/* Decorative Success Glow */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle
              size={56}
              className="text-emerald-500 md:w-16 md:h-16"
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
          Return Verified
        </h2>

        <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed px-2">
          The book has been <span className="text-emerald-600 font-bold underline decoration-2 underline-offset-4">safely archived</span> and stock counts have been updated.
        </p>

        <button
          onClick={() => setShowReturnSuccess(false)}
          className="mt-8 w-full bg-slate-900 text-white py-4 md:py-5 rounded-2xl font-black uppercase text-[11px] md:text-xs tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 shadow-slate-200"
        >
          Close Protocol
        </button>
      </div>
    </motion.div>
  </motion.div>
)}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
}
