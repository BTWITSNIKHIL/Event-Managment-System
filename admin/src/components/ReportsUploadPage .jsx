import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

const ReportUploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'pdf',
    description: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file
      }));
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('description', formData.description);
    data.append('file', formData.file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/report/upload', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success('Report uploaded successfully!');
      navigate('/admin/reports');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Upload failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-20 bg-gradient-to-br from-gray-900 to-gray-800 p-8"
    >
      <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/10 mt-4">
        <motion.h2
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          Upload Report
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Report Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </motion.div>

          <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  <label className="block text-sm font-medium text-gray-300 mb-3">
    Report Type *
  </label>
  <select
    name="type"
    value={formData.type}
    onChange={handleInputChange}
    className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none hover:bg-gray-700 transition-colors"
  >
    <option value="pdf" className="bg-gray-800 text-white hover:bg-gray-700">
      PDF
    </option>
    <option value="excel" className="bg-gray-800 text-white hover:bg-gray-700">
      Excel
    </option>
    <option value="word" className="bg-gray-800 text-white hover:bg-gray-700">
      Word
    </option>
    <option value="other" className="bg-gray-800 text-white hover:bg-gray-700">
      Other
    </option>
  </select>
</motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="3"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select File *
            </label>
            <div
              className={`border-2 border-dashed ${
                isDragging ? 'border-indigo-400' : 'border-white/20'
              } rounded-xl p-8 text-center transition-all duration-300`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FiFile className="text-indigo-400 text-xl" />
                    <span className="text-gray-300">
                      {formData.file.name} ({Math.round(formData.file.size / 1024)}KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FiX className="text-xl" />
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <FiUploadCloud className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Drag & drop files here, or{' '}
                    <label className="text-indigo-400 cursor-pointer hover:text-indigo-300">
                      browse
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        required
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-end space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate('/admin/reports')}
              className="px-6 py-3 border border-white/20 rounded-lg text-gray-300 hover:bg-white/5 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <FiUploadCloud className="text-lg" />
                  Upload Report
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default ReportUploadPage;