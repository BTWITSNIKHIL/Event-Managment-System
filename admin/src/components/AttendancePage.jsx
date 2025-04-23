import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
const AttendancePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:4000/event/${eventId}/participants`,
        { withCredentials: true }
      );
      // Use the attended value directly from the API
      const formattedStudents = data.participants.map(student => ({
        ...student,
        attendance: student.attended // ✅ Use the string directly
      }));
      
      setStudents(formattedStudents);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [eventId]);

  const handleAttendanceChange = (id, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === id ? { ...student, attendance: status } : student
      )
    );
  };
  const handleDownload = () => {
    // Format data for Excel
    const excelData = students.map(student => ({
      "First Name": student.userFirstName,
      "Last Name": student.userLastName,
      "Registration Number": student.registrationNumber,
      "Status": student.attendance.toUpperCase(),
      "Year": student.year,
      "Section": student.section,
      "Email": student.userEmail,
      "Mobile": student.userMobileNumber
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 20 }, // Registration Number
      { wch: 10 }, // Status
      { wch: 5 },  // Year
      { wch: 10 }, // Section
      { wch: 25 }, // Email
      { wch: 15 }  // Mobile
    ];

    // Generate and download file
    XLSX.writeFile(workbook, `attendance_${eventId}.xlsx`);
  };
  const handleSubmit = async () => {
    try {
      const updatedAttendance = students.map(({ _id, attendance }) => ({
        id: _id,
        attended: attendance === "present", // Convert string to boolean
      }));

      await axios.put(
        `http://localhost:4000/event/${eventId}/attendance`,
        { attendance: updatedAttendance },
        { withCredentials: true }
      );
      toast.success("Attendance updated!");
      setStatusMessage("Attendance updated successfully!");
      await fetchStudents(); // Optionally navigate back after success
    } catch (error) {
      toast.error("Failed to update attendance");
      setStatusMessage("Error updating attendance.");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 pt-20">
      <div className="bg-white p-6 rounded shadow-md mb-4">
        <h2 className="text-2xl font-bold mb-4">📌 Mark Attendance</h2>
        <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
          >
            Download Excel
          </button>
        <table className="w-full text-left border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Reg. No</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{student.userFirstName}</td>
                <td className="p-3">{student.userLastName}</td>
                <td className="p-3">{student.registrationNumber}</td>
                <td className="p-3">
                  <select
                    value={student.attendance}
                    onChange={(e) =>
                      handleAttendanceChange(student._id, e.target.value)
                    }
                    className="border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Display the status message after submitting */}
      {statusMessage && (
        <div
          className={`mt-4 p-4 rounded-md ${
            statusMessage.includes("Error") ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
