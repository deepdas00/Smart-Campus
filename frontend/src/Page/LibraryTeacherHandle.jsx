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
  Bell ,
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

const handleNotifyReturnReminders = async () => {
  try {
    setNotifying(true);

    const res = await axios.get(
      "/api/v1/library/notify-return-reminders",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const count = res.data?.data?.notifiedCount || 0;

    toast(`✅ Reminder emails sent to ${count} student(s)`);

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


                  {activeTab === "transactions" && (
    <button
      onClick={handleNotifyReturnReminders}
      disabled={notifying}
      className="flex items-center gap-2 px-4 py-2 rounded-xl
                 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest
                 hover:bg-indigo-700 transition disabled:bg-slate-400"
    >
      {notifying ? (
        "Sending…"
      ) : (
        <>
          <Bell size={14} />
          Notify Students
        </>
      )}
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
                      onClick={() => {
                        setShowAddBookModal(false);
                        handleCloseModal();
                      }}
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
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center">
            {/* Close */}
            <button
              onClick={() => {
                setShowQRScanner(false);
                stopCamera();
              }}
              className="absolute top-5 right-5 bg-white/10 hover:bg-red-500/20 text-white p-2 rounded-full transition"
            >
              <X size={22} />
            </button>

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
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
            >
              {/* 1. Header & Floating Book Cover Detail */}
              <div className="h-32 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative flex items-center px-8">
                <div className="flex flex-col">
                  <h2 className="text-white text-2xl font-black tracking-tight leading-none mb-1">
                    Confirm Issue
                  </h2>
                  <p className="text-indigo-100/70 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Transaction Protocol
                  </p>
                </div>

                {/* THE FLOATING BOOK IMAGE */}
                <div className="absolute -bottom-8 right-8 z-20">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="relative"
                  >
                    <img
                      src={
                        scannedBook.bookId?.coverImage ||
                        scannedBook.bookId?.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Book Cover"
                      className="w-24 h-36 object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                      <CheckCircle size={16} />
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="px-8 pt-12 pb-8">
                {/* 2. Info Cards (Student & Book Details) */}
                <div className="space-y-4 mb-8">
                  {/* Student "Identity Card" */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] shadow-sm">
                    <div className="h-22  bg-indigo-100 rounded-2xl overflow-hidden shadow-lg shadow-indigo-200 border-2 border-white relative group">
                      {scannedBook.studentId?.avatar ? (
                        <img
                          src={scannedBook.studentId.avatar}
                          alt="Student"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-xl">
                          {scannedBook.studentName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-indigo-400 leading-none mb-1.5">
                        Borrower
                      </p>
                      <h4 className="text-slate-900 font-bold text-base leading-none">
                        {scannedBook.studentId.studentName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Roll No: {scannedBook.studentId.rollNo}
                      </p>
                    </div>
                  </div>

                  {/* Book Information Section */}
                  <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-[1.5rem] relative overflow-hidden group">
                    {/* LARGE WATERMARK ICON */}
                    <Library
                      className="absolute -right-6 -bottom-6 text-indigo-200/30 group-hover:scale-110 transition-transform duration-700"
                      size={110}
                    />

                    <div className="relative z-10 pr-20">
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">
                        Book Details
                      </p>
                      <h4 className="text-slate-800 font-bold text-sm leading-snug mb-1">
                        {scannedBook.bookId?.title}
                      </h4>
                      <p className="text-xs text-slate-500 italic mb-4">
                        by {scannedBook.bookId?.author}
                      </p>

                      <div className="flex gap-2">
                        <span className="text-[9px] font-black bg-white border border-slate-200 text-slate-500 px-2.5 py-1 rounded-lg uppercase">
                          Shelf: {scannedBook.bookId?.shelf}
                        </span>
                        <span className="text-[9px] font-black bg-indigo-600 text-white px-2.5 py-1 rounded-lg uppercase">
                          ID: {scannedBook.bookId?._id?.slice(-9).toUpperCase()}
                          ...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. THE "SWIPE TO CONFIRM" SLIDER (Touch & Mouse Support) */}
                <div className="relative h-20 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-[2.5rem] p-2 border-2 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] group overflow-hidden">
                  {/* 1. VIBRANT PROGRESS FILL - Reactive Gradient */}
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 pointer-events-none"
                    style={{
                      width: swipeProgress
                        ? `${(swipeProgress / 260) * 100}%`
                        : "0%",
                    }}
                  />

                  {/* 2. NEON HINT TEXT - Glowing & Moving */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-3">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 font-black text-[11px] uppercase tracking-[0.4em] animate-pulse">
                        Authorize Issue
                      </span>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <ArrowRight
                            key={i}
                            size={14}
                            className="text-indigo-500 animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. THE "POWER" KNOB (The Draggable Button) */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 260 }}
                    dragElastic={0.1}
                    dragSnapToOrigin
                    onDragEnd={(event, info) => {
                      // Your Original Logic
                      if (info.offset.x > 200) {
                        setShowConfirmIssue(false);
                        handleIssueScannedBook();
                      }
                    }}
                    // VIBRANT UI STYLES
                    className="z-10 w-16 h-16 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[1.8rem] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)] border-t border-white/30 relative overflow-hidden group/knob"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 30px -10px rgba(79,70,229,0.7)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Rotating Glow Background */}
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,white,transparent)] opacity-20 animate-[spin_4s_linear_infinite]" />

                    <Zap
                      className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform duration-500 group-hover/knob:scale-125 group-hover/knob:rotate-12"
                      size={26}
                      fill="currentColor"
                    />
                  </motion.div>

                  {/* 4. THE GOAL (Target Zone) - Pulsing Portal */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="relative flex items-center justify-center">
                      {/* Outer ring */}
                      <div className="absolute w-12 h-12 rounded-full border-2 border-indigo-200 border-dashed animate-[spin_10s_linear_infinite]" />

                      {/* Inner pulsing core */}
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-500">
                        <CheckCircle
                          size={18}
                          className="text-indigo-200 group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. FOOTER / DEVELOPER CREDITS */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setShowConfirmIssue(false)}
                    className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all group"
                  >
                    <X
                      size={14}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    Cancel
                  </button>

                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">
                      System Architect
                    </p>
                    <p className="text-[11px] font-bold text-indigo-500/60 font-mono italic tracking-tighter">
                      YourName.Dev
                    </p>
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
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.5, y: 100, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.5, y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="relative bg-white p-8 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] max-w-sm w-full text-center overflow-hidden border border-white"
              >
                {/* Animated Background Sunburst */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"
                />

                {/* Success Icon with Pulse */}
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-200"
                  >
                    <CheckCircle
                      size={48}
                      className="text-white"
                      strokeWidth={3}
                    />
                  </motion.div>

                  {/* Decorative Sparks */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: (i - 2.5) * 40,
                        y: -60,
                      }}
                      transition={{
                        delay: 0.3,
                        duration: 0.8,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>

                {/* Text Content */}
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">
                  BOOK ISSUED!
                </h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                  The transaction was authorized successfully. The student can
                  now collect the book.
                </p>

                {/* Engaging Dismiss Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Got it, Thanks!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RETURN CONFIRM MODAL */}
        <AnimatePresence>
          {showReturnModal && returnData && (
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white/90 backdrop-blur-2xl w-full max-w-[440px] rounded-[3.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white overflow-hidden"
                initial={{ scale: 0.8, y: 100, rotateX: 20 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 120 }}
              >
                {/* Animated Background Orbs */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />

                {/* Floating Return Icon */}
                <div className="relative mb-8 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-slate-300"
                  >
                    <RotateCcw size={36} className="text-emerald-400" />
                  </motion.div>
                </div>

                {/* Content Header */}
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Verify Return
                  </h2>
                  <div className="h-1.5 w-12 bg-indigo-600 mx-auto rounded-full" />
                </div>

                {/* Details Card (Modern Glass) */}
                <div className="bg-slate-50/50 rounded-[2rem] p-6 mb-8 border border-white/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Student
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {returnData.studentId.studentName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Book Title
                    </span>
                    <span className="text-sm font-bold text-indigo-600 text-right max-w-[180px] leading-tight">
                      {returnData.bookId.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Transaction Code
                    </span>
                    <span className="text-sm font-bold text-indigo-600 text-right max-w-[180px] leading-tight">
                      {returnData.transactionCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Issue Date
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {new Date(returnData.issueDate).toLocaleString()}

                    </span>
                  </div>
                </div>

                {/* Swipe Component (Assumed to be styled similarly) */}
                <div className="px-2">
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
                  className="mt-8 w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] hover:text-red-500 transition-all active:scale-95"
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl p-6 w-[360px] text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <CheckCircle
                  size={56}
                  className="mx-auto text-green-500 mb-4"
                />

                <h2 className="text-xl font-semibold mb-2">
                  Book Returned Successfully
                </h2>

                <p className="text-gray-600">
                  The book has been safely returned to the library.
                </p>

                <button
                  onClick={() => setShowReturnSuccess(false)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
}
