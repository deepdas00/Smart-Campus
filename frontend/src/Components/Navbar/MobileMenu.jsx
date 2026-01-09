import { Link } from "react-router-dom";

export default function MobileMenu() {
  return (
    <div className="md:hidden bg-white border-t">
      <div className="px-4 py-4 space-y-3">
        <a href="#features" className="block text-gray-700 hover:text-blue-600">
          Features
        </a>
        <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600">
          How It Works
        </a>
        <a href="#impact" className="block text-gray-700 hover:text-blue-600">
          Impact
        </a>
        <a href="#contact" className="block text-gray-700 hover:text-blue-600">
          Contact
        </a>

        <Link
          to="/login"
          className="block w-full text-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg"
        >
          Login
        </Link>

        <Link
          to="/report"
          className="block w-full text-center px-4 py-2 bg-blue-700 text-white rounded-lg"
        >
          Report Issue
        </Link>
      </div>
    </div>
  );
}
