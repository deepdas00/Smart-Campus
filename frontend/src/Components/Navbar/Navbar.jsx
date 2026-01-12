import { useState, useEffect } from "react";
import { AlertCircle, Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import logo from "../../assets/logo.png";
import admin from "../../assets/Admin.png";
import librarian from "../../assets/LibraryAdmin.png";
import canteen from "../../assets/CanteenAdmin.png";
import { useAuth } from "../../context/AuthContext";
import profile from "../../assets/profile.png";
import ProfileSidebar from "../ProfileSidebar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";

const API_URL = import.meta.env.VITE_API_URL;
import { BookMarked, ChevronRight, ShoppingCart, ChefHat } from "lucide-react";

export default function Navbar({
  onMyBooksClick,
  myBooksCount,
  onCartClick,
  orderPlaced,
  orderReceived,
  cartCount,
  showCart,
  bookReceived,
  bookingSuccess,
  showMyBooks,
  showIssueModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLibraryPage = location.pathname === "/library";
  const isCanteenPage = location.pathname === "/canteen";
  const isOrderPage = location.pathname === "/orders";


  const [collegeInfo, setCollegeInfo] = useState("")
  const [collegeDept, setCollegeDept] = useState([])
  const { user } = useAuth();
  const { logout } = useAuth();
  


  function FloatingCartButton({ children }) {
  return createPortal(children, document.body);
}




  const handleLogout = async () => {
    try {
      toast.loading("Logging out...", { id: "logout" });

      await axios.post(
        `${API_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );

      logout(); // clear context
      toast.success("Logged out successfully", { id: "logout" });

      navigate("/login", { replace: true });

    } catch (error) {
      console.error(error);
      toast.error("Logout failed", { id: "logout" });
    }
  };

  function LogoutItem({ icon, label, onLogout }) {
    return (
      <button
        onClick={onLogout}
        className="w-full group flex items-center justify-between px-4 py-3 rounded-lg transition hover:bg-red-50 text-red-600"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white shadow-sm rounded-md">{icon}</div>
          <span className="font-medium">{label}</span>
        </div>

        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
      </button>
    );
  }

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      // Already on home → smooth scroll
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to home, then scroll
      navigate("/", { replace: false });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  



    
  const fetchCollegeInfo = async () => {
    try {

      
      const res = await axios.get(`${API_URL}/api/v1/college/info-limit`, {
        withCredentials: true,
      });


      setCollegeInfo(res.data.data.collegeInfo);
      setCollegeDept(res.data.data.departments);
     
    } catch (err) {
      console.error("Fetch college info failed", err);
    }
  };


useEffect(() => {
  if (!user) return;
   fetchCollegeInfo();
}, [user]);

  
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      {user ? (
        user.role === "student" ? (
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link to={"/home"} className="flex items-center space-x-2">
                    <img
                      src={collegeInfo?.logo || logo}
                      alt="Smart Campus Logo"
                      className="md:w-13.5 lg:w-13.5 lg:h-13.5 md:h-13.5 w-10 h-10 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                    />
                    <span className="md:text-xl sm:text-lg text-[3.4vw] font-bold bg-blue-700  bg-clip-text text-transparent ">
                      {collegeInfo?.collegeName || "Smart Campus"}
                      <p className="sm:text-[11px] text-[8px] font-normal bg-gray-500 bg-clip-text text-transparent ">
                        Powered by <span className="font-semibold ">
                          Smart Campus
                        </span>
                      </p>
                    </span>
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
{isLibraryPage && !showIssueModal && !showMyBooks && !bookingSuccess && !bookReceived && (
  <FloatingCartButton>
    <button
      onClick={onMyBooksClick}
      className="
        fixed bottom-7 right-6 z-[9999]
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-blue-600 text-white
        hover:bg-blue-700 transition
        sm:hidden
      "
    >
      <BookMarked className="w-5 h-5" />

      {myBooksCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {myBooksCount}
        </span>
      )}
    </button>
  </FloatingCartButton>
)}


{isLibraryPage && (
  <button
    onClick={onMyBooksClick}
    className="
      hidden sm:flex
      relative items-center gap-2
      px-3 py-1.5
      bg-blue-600 text-white rounded-lg
      hover:bg-blue-700 transition
    "
  >
    <BookMarked className="w-4 h-4" />
    <span>My Books</span>

    {myBooksCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {myBooksCount}
      </span>
    )}
  </button>
)}


{isCanteenPage && !showCart && !orderPlaced && (
  <FloatingCartButton>
    <button
      onClick={onCartClick}
      className="
        fixed bottom-7 right-6 z-[9999]
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-blue-600 text-white
        hover:bg-blue-700 transition
        sm:hidden
      "
    >
      <ShoppingCart className="w-5 h-5" />

      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </button>
  </FloatingCartButton>
)}

{isCanteenPage && (
  <button
    onClick={onCartClick}
    className="
      hidden sm:flex
      items-center gap-2
      px-3 py-1.5
      bg-blue-600 text-white rounded-lg
      hover:bg-blue-700 transition
      relative
    "
  >
    <ShoppingCart className="w-4 h-4" />
    <span>Cart</span>

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {cartCount}
      </span>
    )}
  </button>
)}

{isOrderPage && (
  <FloatingCartButton>
    <Link
      to="/canteen"
      className="
        fixed bottom-7 right-6 z-[9999]
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-blue-600 text-white
        hover:bg-blue-700 transition
        sm:hidden
      "
    >
      <ChefHat className="w-5 h-5" />
    </Link>
  </FloatingCartButton>
)}


{isOrderPage && (
  <Link
    to="/canteen"
    className="
      hidden sm:flex
      relative items-center gap-2
      px-3 py-1.5
      bg-blue-600 text-white rounded-lg
      hover:bg-blue-700 transition
    "
  >
    <ChefHat className="w-4 h-4" />
    <span>Canteen</span>
  </Link>
)}



                  <span
                    onClick={handleLogout}
                    className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500"
                  >
                    Logout
                  </span>

                  <Link className="flex items-center space-x-2">
                    <img
                      src={user?.profilePhoto}
                      alt="Profile"
                      onClick={() => setShowProfileMenu(true)}
                      className="md:w-13.5 lg:w-13.5 lg:h-13.5 md:h-13.5 w-10 h-10 rounded-full object-cover bg-white/60 backdrop-blur border-2 border-black/90 shadow"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </header>
        ) : (
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-105">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between space-x-2">
                  <Link to={"/home"} className="flex items-center space-x-2">
                    <img
                      src={collegeInfo?.logo || logo}
                      alt="Smart Campus Logo"
                      className="md:w-13.5 lg:w-13.5 lg:h-13.5 md:h-13.5 w-10 h-10 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                    />
                    <span className="md:text-xl sm:text-lg text-[3.4vw] font-bold bg-blue-700  bg-clip-text text-transparent ">
                      {collegeInfo?.collegeName || "Smart Campus"}
                      <p className="sm:text-[11px] text-[8px] font-normal bg-gray-500 bg-clip-text text-transparent ">
                        Powered by <span className="font-semibold ">
                          Smart Campus
                        </span>
                      </p>
                    </span>
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
                  <span
                    onClick={handleLogout}
                    className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500"
                  >
                    Logout
                  </span>

                  <Link className="flex items-center space-x-2">
                    <img
                      src={
      user?.role === "librarian"
        ? librarian
        : user?.role === "canteen"
        ? canteen
        : user?.role === "admin"
        ? admin
        : user?.profilePhoto // fallback for regular users
    }

                      alt="Profile"
                      onClick={() => setShowProfileMenu(true)}
                      className="md:w-13.5 lg:w-13.5 lg:h-13.5 md:h-13.5 w-10 h-10 rounded-full object-cover bg-white/60 backdrop-blur border-2 border-black/90 shadow"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </header>
        )
      ) : (
        <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm md:py-1.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="md:w-13.5 lg:w-13.5 lg:h-13.5 md:h-13.5 w-10 h-10 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />

                <span className="md:text-xl text-lg font-bold bg-blue-700 bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </button>

              {/* Desktop Links */}
              <NavLinks />

              {/* Mobile Toggle */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && <MobileMenu />}
        </nav>
      )}

      {/* Profile menu side bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />
    </>
  );
}
