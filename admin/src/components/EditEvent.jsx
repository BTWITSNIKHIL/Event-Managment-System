import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { FiCalendar, FiImage, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    venue: '',
    poster: null
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/event/${eventId}`, {
          withCredentials: true
        });
        
        setFormData({
          ...response.data.event,
          startDate: new Date(response.data.event.dateTime.start),
          endDate: new Date(response.data.event.dateTime.end)
        });
      } catch (err) {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('eventName', formData.eventName);
      form.append('description', formData.description);
      form.append('dateTime[start]', formData.startDate.toISOString());
      form.append('dateTime[end]', formData.endDate.toISOString());
      form.append('venue', formData.venue);
      
      if (file) {
        form.append('poster', file);
      }

      const response = await axios.put(
        `http://localhost:4000/event/admin/updateEvent/${eventId}`,
        form,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update event');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFormData(prev => ({
      ...prev,
      poster: URL.createObjectURL(selectedFile)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center pt-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiCalendar className="text-2xl" />
            Edit Event
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiCalendar /> Start Date
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData({ ...formData, startDate: date })}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiCalendar /> End Date
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => setFormData({ ...formData, endDate: date })}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiImage /> Event Poster
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center px-4 py-6 bg-white/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-500 transition-colors w-full">
                  <span className="text-sm text-gray-600">Click to upload new poster</span>
                  <input
                    type="file"
                    name="poster"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {(formData.poster || file) && (
                  <img 
                    src={formData.poster} 
                    alt="Current poster preview" 
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                )}
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-3"
            >
              <FiAlertCircle className="text-xl" />
              {error}
            </motion.div>
          )}

          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={() => navigate('/admin')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gray-500 text-white rounded-xl flex items-center gap-2 hover:bg-gray-600 transition-all"
            >
              <FiX className="text-lg" />
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <FiSave className="text-lg" />
              Update Event
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditEvent;