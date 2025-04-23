import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiDownload, FiArrowLeft, FiSearch, FiUserCheck } from "react-icons/fi";

const StudentData = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [eventRes, participantsRes] = await Promise.all([
          axios.get(`http://localhost:4000/event/${eventId}`, { 
            withCredentials: true 
          }),
          axios.get(`http://localhost:4000/event/${eventId}/participants`, { 
            withCredentials: true 
          })
        ]);

        setEvent(eventRes.data);
        const participantsData = participantsRes.data?.participants || [];
        const formattedParticipants = participantsData.map(participant => ({
          ...participant,
          year: participant.year.toString()
        }));
        setStudents(formattedParticipants);
      } catch (err) {
        setError("Failed to load event data");
        if(err.response?.status === 401) navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigate]);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.userFirstName} ${student.userLastName}`.toLowerCase();
    return (
      (selectedYear === "All" || student.year === selectedYear) &&
      (selectedSection === "All" || student.section === selectedSection) &&
      fullName.includes(searchQuery.toLowerCase())
    );
  });

  const formatYear = (year) => {
    switch(year) {
      case "1": return "1st Year";
      case "2": return "2nd Year";
      case "3": return "3rd Year";
      case "4": return "4th Year";
      default: return year;
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
      "Event Name": event?.eventName || "Event",
      "First Name": student.userFirstName,
      "Last Name": student.userLastName,
      "Registration Number": student.registrationNumber,
      "Mobile Number": student.userMobileNumber,
      "Section": student.section,
      "Year": formatYear(student.year),
      "Participation Date": new Date(student.dateParticipated).toLocaleDateString()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, `${event?.eventName || 'Event'}_Participants.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text(`${event?.eventName || 'Event'} Participants (${date})`, 14, 22);

    const columns = [
      { title: "Event Name", dataKey: "eventName" },
      { title: "First Name", dataKey: "firstName" },
      { title: "Last Name", dataKey: "lastName" },
      { title: "Reg No", dataKey: "regNo" },
      { title: "Mobile", dataKey: "mobile" },
      { title: "Section", dataKey: "section" },
      { title: "Year", dataKey: "year" }
    ];

    const rows = filteredStudents.map(student => ({
      eventName: event?.eventName || 'Event',
      firstName: student.userFirstName,
      lastName: student.userLastName,
      regNo: student.registrationNumber,
      mobile: student.userMobileNumber,
      section: student.section,
      year: formatYear(student.year)
    }));

    doc.autoTable({
      columns,
      body: rows,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });

    doc.save(`${event?.eventName || 'Event'}_Participants.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-red-100 p-6 rounded-xl max-w-md text-center animate-fade-in">
          <div className="text-red-600 text-4xl mb-3">⚠️</div>
          <h2 className="text-red-700 font-semibold text-xl mb-2">Loading Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-2xl rounded-2xl p-6 mb-6 animate-slide-down">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-white text-center md:text-left">
            Registered Students for<br />
            <span className="text-3xl bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              {event?.eventName}
            </span>
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={downloadExcel}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <FiDownload className="text-lg" />
              Excel
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <FiDownload className="text-lg" />
              PDF
            </button>
            <button
              onClick={() => navigate(`/admin/event/${eventId}/attendance`)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <FiUserCheck className="text-lg" />
              Attendance
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <FiArrowLeft className="text-lg" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mt-6 flex flex-wrap gap-4 items-center bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          <option value="All">All Years</option>
          {[1, 2, 3, 4].map(year => (
            <option key={year} value={year}>{formatYear(year.toString())}</option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          <option value="All">All Sections</option>
          {['A', 'B', 'C'].map(section => (
            <option key={section} value={section}>Section {section}</option>
          ))}
        </select>
      </div>

      {/* Table Section */}
      <div className="mt-6 bg-white/30 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="p-4 border-b border-white/20">
          <h3 className="text-xl font-semibold text-indigo-600 flex items-center gap-2">
            📋 Student List ({filteredStudents.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600/10">
              <tr>
                {['First Name', 'Last Name', 'Reg. No', 'Mobile', 'Section', 'Year'].map((header, index) => (
                  <th 
                    key={header}
                    className={`p-4 text-left text-gray-700 font-medium ${
                      index === 0 ? 'rounded-tl-2xl' : 
                      index === 5 ? 'rounded-tr-2xl' : ''
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr 
                  key={index}
                  className="border-t border-white/20 hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="p-4 font-medium text-gray-800 group-hover:pl-6 transition-all">
                    {student.userFirstName}
                  </td>
                  <td className="p-4 text-gray-600">{student.userLastName}</td>
                  <td className="p-4 font-mono text-indigo-600">
                    {student.registrationNumber}
                  </td>
                  <td className="p-4 text-gray-600">{student.userMobileNumber}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {student.section}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {formatYear(student.year)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No students found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentData;