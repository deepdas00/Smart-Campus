import React from 'react'
import {
  AlertCircle,
  Camera,
  MapPin,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Bell,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div>
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-blue-700 bg-clip-text text-transparent">
                Smart Campus
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
              <a href="#impact" className="text-gray-700 hover:text-blue-600 transition">Impact</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            </div>

            <div className="hidden md:flex space-x-4">
              <Link
              to='/signup'
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                Login
              </Link>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:shadow-lg transition">
                Report Issue
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600">How It Works</a>
              <a href="#impact" className="block text-gray-700 hover:text-blue-600">Impact</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
              <button className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg">
                Login
              </button>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                Report Issue
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Nav
