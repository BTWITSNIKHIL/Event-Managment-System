import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiTrash, FiUploadCloud, FiLoader } from 'react-icons/fi';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 50 }
};

const ReportsListPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:4000/api/report', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setReports(data.reports);
      } catch (error) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/report/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        setReports(prev => prev.filter(report => report.id !== reportId));
        toast.success('Report deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-indigo-500"
        >
          <FiLoader className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-gray-100 p-8 pt-20 "
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Manage Reports
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/upload-reports')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all"
          >
            <FiUploadCloud className="w-5 h-5" />
            <span>Upload New Report</span>
          </motion.button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 rounded-xl shadow-xl overflow-x-auto"
        >
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-700">
              <AnimatePresence>
                {reports.map(report => (
                  <motion.tr
                    key={report.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{report.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{report.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                        >
                          <FiEye className="w-5 h-5" />
                          <span>View</span>
                        </a>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                        >
                          <FiTrash className="w-5 h-5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {reports.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              <FiUploadCloud className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-xl">No reports found. Upload your first report.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportsListPage;