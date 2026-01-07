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
import { useAuth } from '../context/AuthContext';

function Nav() {

  const [onClose, setOnClose] = useState(second)

  const {user} = useAuth()
  return (
    <div>
      {/* Header */}
              <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition"
                >
                  <X className="w-5 h-5" />
                </button>
      
                {/* User Info */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.studentName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {shortName.toUpperCase()}
                      </span>
                    )}
                  </div>
      
                  <div>
                    <h3 className="text-lg font-semibold">{studentName} Dashboard</h3>
                    <p className="text-sm text-blue-100">{rollNo}</p>
                  </div>
                </div>
              </div>
    </div>
  )
}

export default Nav
