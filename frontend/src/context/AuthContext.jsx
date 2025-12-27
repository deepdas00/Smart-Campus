import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const fetchUser = async () => {
  try {
    const endpoints = [
      "/api/v1/auth/student/me",          // student
      "/api/v1/auth/staff/me",    // staff / canteen admin
    ];

    let foundUser = null;

    for (const endpoint of endpoints) {
      const res = await axios.get(
        `${API_URL}${endpoint}`,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200 && res.data?.data) {
        foundUser = res.data.data;
        break;
      }
    }

    
    

    setUser(foundUser);
  } catch (err) {
    console.error("Auth check failed:", err);
    setUser(null);
  } finally {
    setLoading(false);
  }
};


const logout = () => {
    setUser(null);
  };


  useEffect(() => {
    // Inside AuthContext.jsx

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
