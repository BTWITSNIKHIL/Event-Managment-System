import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiHome, 
  FiUserPlus, 
  FiCalendar, 
  FiUpload, 
  FiFileText,
  FiLogOut
} from "react-icons/fi";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full h-16 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Animated Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link
              to="/admin-dashboard"
              className="flex items-center space-x-2"
            >
              {/* DEMS Logo with animated gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-baseline"
              >
                <motion.div
                  className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  <span className="text-2xl font-bold tracking-wide">
                    DEMS
                  </span>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItem 
              to="/admin-dashboard" 
              icon={<FiHome className="mr-2" />} 
              label="Dashboard"
            />
            <NavItem
              to="/add-admin"
              icon={<FiUserPlus className="mr-2" />}
              label="Add Admin"
            />
            <NavItem
              to="/admin/createEvent"
              icon={<FiCalendar className="mr-2" />}
              label="Create Event"
            />
            <NavItem
              to="/admin/upload-reports"
              icon={<FiUpload className="mr-2" />}
              label="Upload Reports"
            />
            <NavItem
              to="/admin/reports"
              icon={<FiFileText className="mr-2" />}
              label="Reports"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/logout"
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300"
              >
                <FiLogOut className="mr-2" />
                Logout
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

// NavItem component
const NavItem = ({ to, icon, label }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  </motion.div>
);

export default Navbar;