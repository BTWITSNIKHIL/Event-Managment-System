import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("http://localhost:4000/admin/logout", {}, {
          withCredentials: true, // Important for cookie-based auth
        });
        toast.success("Logged out successfully!");
        navigate("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
        navigate("/admin/login"); // Redirect anyway
      }
    };

    logout();
  }, [navigate]);

  return null; // No need to render anything
};

export default Logout;
