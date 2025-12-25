import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useFetchUser = () => {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/v1/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
};
