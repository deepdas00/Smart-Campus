import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CollegeContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const CollegeProvider = ({ children }) => {
  const [collegeInfo, setCollegeInfo] = useState(null);       // navbar
  const [collegeFullInfo, setCollegeFullInfo] = useState(null); // admin
  const [loading, setLoading] = useState(true);

  // 🔹 navbar data (small)
  const fetchCollegeInfo = async () => {
    const res = await axios.get(
      `${API_URL}/api/v1/college/info-limit`,
      { withCredentials: true }
    );
    console.log("//////////////////", res.data.data);
    
    setCollegeInfo(res.data.data.collegeInfo);
  };

  // 🔹 admin data (full)
  const fetchCollegeFullInfo = async () => {
    const res = await axios.get(
      `${API_URL}/api/v1/college/info-full`,
      { withCredentials: true }
    );
    console.log("//////////////////////////////",res.data.data);
    
    setCollegeFullInfo(res.data.data);
  };

  // 🔹 update (used by admin)
  const updateCollegeInfo = (updatedData) => {
    setCollegeInfo((prev) => ({
      ...prev,
      ...updatedData,
    }));
    setCollegeFullInfo(updatedData);
  };

  useEffect(() => {
    Promise.all([fetchCollegeInfo(), fetchCollegeFullInfo()])
      .finally(() => setLoading(false));
  }, []);

  return (
    <CollegeContext.Provider
      value={{
        collegeInfo,
        collegeFullInfo,
        loading,
        updateCollegeInfo,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => useContext(CollegeContext);
