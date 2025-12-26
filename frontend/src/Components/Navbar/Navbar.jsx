import { useState } from "react";
import { AlertCircle, Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import profile from "../../assets/profile.png";
import ProfileSidebar from "../ProfileSidebar";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {user} = useAuth();

  return (

    <>
    {user? (user.role === "student" ? (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
            
              <span className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500">
                Logout
              </span>
              <Link className="flex items-center space-x-2">
                <img
                  src={user?.avatar}
                  alt="Profile"
                  onClick={() => setShowProfileMenu(true)}
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border-2 border-black/90 shadow"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
    ):(<header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-105">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
            
              <span className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500">
                Logout
              </span>
              
            </div>
          </div>
        </div>
      </header>)):(

      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm py-1.5">
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
                className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
              />
            
            <span className="text-xl font-bold bg-blue-700 bg-clip-text text-transparent">
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
