import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";   // adjust path if needed
import { connectSocket } from "../socket/connectSocket";
import { socket } from "../socket";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const API_URL = import.meta.env.VITE_API_URL;
  const MIN_LOADING_TIME = 1; // 3 seconds
  const startTime = Date.now();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
const fetchUser = async () => {
  try {
    const endpoints = [
      "/api/v1/auth/student/me",
      "/api/v1/auth/staff/me",
    ];

    let foundUser = null;

    for (const endpoint of endpoints) {
      const res = await API.get(endpoint, {
        validateStatus: (status) => status < 500,
      });

      if (res.status === 200 && res.data?.data) {
        foundUser = res.data.data;
        break;
      }
    }

    setUser(foundUser);
  } catch (err) {
    console.error("Auth check failed:", err);
    setUser(null);
  } const elapsed = Date.now() - startTime;
    const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);

    setTimeout(() => {
      setLoading(false);
    }, remaining);
};


const logout = () => {
  if (socket.connected) {
    socket.disconnect();
  }
  setUser(null);
};



  useEffect(() => {
    // Inside AuthContext.jsx

    fetchUser();
  }, []);

  useEffect(() => {
    
    console.log("IHIHIIHIH", user?.collegeCode, user?.role, user);
    if (user?.collegeCode && user?.role) {
    connectSocket({
      collegeCode: user.collegeCode,
      role: user.role, // "student" | "staff" | "admin"
    });
  }
}, [user]);


  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
