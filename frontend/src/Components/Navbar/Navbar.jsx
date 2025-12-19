import { useState } from "react";
import { AlertCircle, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import logo from "../../assets/logo.png";

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

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm py-1">
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
  );
}
