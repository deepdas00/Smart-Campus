import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import profile from "../../assets/profile.png";
import { useState } from "react";
import ProfileSidebar from "../ProfileSidebar";

export default function NavLinks() {
  const navigate = useNavigate();
  const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
  

  const handleScroll = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const { user } = useAuth();
  console.log(user, "hai re bahi");
  

  return (
    <>
      {/* Section Links */}
      <div className="hidden md:flex space-x-8">
        <button
          onClick={() => handleScroll("features")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Features
        </button>

        <button
          onClick={() => handleScroll("how-it-works")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          How It Works
        </button>

        <button
          onClick={() => handleScroll("impact")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Impact
        </button>

        <button
          onClick={() => handleScroll("contact")}
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Contact
        </button>
      </div>

      {/* Auth / CTA */}
      <div className="hidden md:flex space-x-4">
        <Link
          to="/report"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:shadow-lg transition"
        >
          Report Issue
        </Link>

        {user ? (
          user.role === "student" ? (
            <Link className="flex items-center space-x-2">
              <img
                src={profile}
                alt="Profile"
                onClick={() => setShowProfileMenu(true)}
                className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
              />
            </Link>
          ) : (
            <Link
              to="/profile"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Logout
            </Link>
          )
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Login
          </Link>
        )}

        {/* Profile menu side bar */}
                      <ProfileSidebar
                        isOpen={showProfileMenu}
                        onClose={() => setShowProfileMenu(false)}
                      />
      </div>
    </>
  );
}
