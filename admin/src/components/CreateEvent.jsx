

// CreateEvent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FiCalendar, FiClock, FiMapPin, FiImage, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

// Color Scheme
const colors = {
  primary: "#6366f1",
  secondary: "#4f46e5",
  accent: "#f59e0b",
  background: "#0f172a",
  text: "#f8fafc"
};

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    dateTime: { start: '', end: '' },
    venue: '',
    poster: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, poster: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('eventName', formData.eventName);
    data.append('description', formData.description);
    data.append('dateTime[start]', formData.dateTime.start);
    data.append('dateTime[end]', formData.dateTime.end);
    data.append('venue', formData.venue);
    if (formData.poster) data.append('poster', formData.poster);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post('http://localhost:4000/event/user/create/event', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      toast.success('Event created successfully!');
      setFormData({
        eventName: '',
        description: '',
        dateTime: { start: '', end: '' },
        venue: '',
        poster: null
      });
      setPreviewImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20"
      style={{ background: colors.background }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Create New Event
          </h1>
          <p className="mt-3 text-gray-300">Fill in the details below to create a new event</p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          onSubmit={handleSubmit}
          className="space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
        >
          {/* Event Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100 border-b border-white/20 pb-2">
              <FiCalendar className="inline-block mr-2 text-purple-400" />
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Date & Time */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100 border-b border-white/20 pb-2">
              <FiClock className="inline-block mr-2 text-purple-400" />
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="dateTime.start"
                  value={formData.dateTime.start}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="dateTime.end"
                  value={formData.dateTime.end}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Venue */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100 border-b border-white/20 pb-2">
              <FiMapPin className="inline-block mr-2 text-purple-400" />
              Venue Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Venue Location *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-400 transition-all"
                required
              />
            </div>
          </motion.div>

          {/* Poster Upload */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-100 border-b border-white/20 pb-2">
              <FiImage className="inline-block mr-2 text-purple-400" />
              Event Poster
            </h2>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-8"
            >
              <AnimatePresence mode='wait'>
                {previewImage ? (
                  <motion.img
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={previewImage}
                    alt="Event poster preview"
                    className="max-h-64 rounded-lg mb-4 shadow-md"
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center mb-4"
                  >
                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto" />
                    <p className="text-gray-400 mt-2">Drag & drop or click to upload</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
              >
                <span>Choose File</span>
                <input
                  type="file"
                  name="poster"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </motion.label>
              <p className="text-gray-400 text-sm mt-2">JPEG, PNG or WEBP (Max 5MB)</p>
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-6 w-6 border-b-2 border-white rounded-full"
                />
              ) : (
                'Create Event'
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default CreateEvent;