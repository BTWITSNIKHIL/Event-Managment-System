
import { v2 as cloudinary } from 'cloudinary';
import Report from '../models/reportSchema.js';

// Configure Cloudinary


export const uploadReport = async (req, res) => {
  try {
     cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: "Admin privileges required"
      });
    }

    const { name, type, description } = req.body;
    const file = req.file;

    if (!name || !type || !file) {
      return res.status(400).json({
        success: false,
        message: "Name, type, and file are required"
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'reports'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });
   
    
    // Create report record
    const newReport = new Report({
      name,
      type,
      description,
      fileUrl: result.secure_url,
      uploadedBy: req.admin._id
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Report uploaded successfully",
      report: {
        id: newReport._id,
        name: newReport.name,
        type: newReport.type,
        url: newReport.fileUrl,
        createdAt: newReport.createdAt
      }
    });

  } catch (error) {
    console.error('Report upload error:', error);
    
    // Delete from Cloudinary if upload failed after Cloudinary upload
    if (error.name === 'ValidationError') {
      await cloudinary.uploader.destroy(result.public_id);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload report'
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports: reports.map(report => ({
        id: report._id,
        name: report.name,
        type: report.type,
        description: report.description,
        url: report.fileUrl,
        uploadedBy: report.uploadedBy,
        createdAt: report.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    // Delete from Cloudinary
    const publicId = report.fileUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`reports/${publicId}`);

    // Delete from database
    await Report.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Report deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report'
    });
  }
};