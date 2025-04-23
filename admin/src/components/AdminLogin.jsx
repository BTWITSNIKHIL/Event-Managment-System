import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

const colors = {
  primary: "#6366f1",
  secondary: "#4f46e5",
  accent: "#f59e0b",
  background: "#0f172a",
  text: "#f8fafc"
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      boxShadow: `0 0 15px ${colors.primary}`
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/admin-verify", {
          withCredentials: true,
        });
        if (data.success) navigate("/admin-dashboard");
      } catch (error) {}
    };
    checkSession();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    if (!formData.password.trim()) newErrors.password = "Password is required!";
    if (formData.email && !formData.email.endsWith("@poornima.org")) {
      newErrors.email = "Only Poornima emails allowed!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/admin/login",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        toast.success("Login successful!");
        setTimeout(() => navigate("/admin-dashboard"), 500);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md"
        style={{
          background: `rgba(15, 23, 42, 0.7)`,
          boxShadow: `0 8px 32px rgba(31, 38, 135, 0.37)`,
          border: `1px solid rgba(255, 255, 255, 0.18)`
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `radial-gradient(600px circle at var(--x) var(--y), 
                  ${colors.primary}20, transparent 40%)`
              }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-center mb-8"
          >
            <FaUserShield 
              className="text-5xl mx-auto mb-4" 
              style={{ color: colors.primary }}
            />
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Admin Portal
            </h2>
            {/* <p className="text-gray-400">Admin Portal</p> */}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-gray-300 mb-2">Email</label>
              <motion.input
                type="email"
                name="email"
                variants={inputVariants}
                whileFocus="focus"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none"
                placeholder="admin@poornima.org"
                style={{ caretColor: colors.primary }}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm mt-1 flex items-center"
                >
                  ⚠️ {errors.email}
                </motion.p>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-gray-300 mb-2">Password</label>
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-indigo-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-xl" />
                  ) : (
                    <FaEye className="text-xl" />
                  )}
                </motion.button>
              </motion.div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm mt-1 flex items-center"
                >
                  ⚠️ {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-6 w-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <FiLogIn className="text-xl" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>

            {errors.general && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-center text-sm"
              >
                ⚠️ {errors.general}
              </motion.p>
            )}
          </form>
        </div>

        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-indigo-400 rounded-full"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;