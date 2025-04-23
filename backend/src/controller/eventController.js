import Event from "../models/Event.js";
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const createEvent = async (req, res) => {
  try {
    // Dynamically configure Cloudinary with environment variables
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
    const { eventName, description, dateTime, venue } = req.body;

    if (!eventName || !description || !venue) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let imageUrl = null;
    if (req.file) {
      console.log('Cloudinary config before upload:', {
        cloud_name: cloudinary.config().cloud_name,
        api_key: cloudinary.config().api_key,
        api_secret: cloudinary.config().api_secret ? '[REDACTED]' : undefined
      });

      if (!cloudinary.config().api_key) {
        throw new Error("Cloudinary API key is not configured");
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'event_posters',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error details:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newEvent = new Event({
      eventName,
      description,
      dateTime: {
        start: new Date(dateTime.start),
        end: new Date(dateTime.end)
      },
      venue,
      poster: imageUrl
    });

    console.log("New event before save:", newEvent);
    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const profile = async (req, res, next) => {
  res.send("profile checked");
};

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    if (!events.length)
      return res.status(404).json({ message: "No events found" });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error getting all Events:", error); // Fixed typo: 'err' to 'error'
    res.status(500).send("Internal Server Problem");
  }
};

// Add this helper function at the top of your controller file
const getPublicIdFromUrl = (url) => {
  const matches = url.match(/\/upload\/v\d+\/(.+?)\./);
  return matches ? matches[1] : null;
};

// Update the deleteEvent controller
export const deleteEvent = async (req, res, next) => {
  const { eventId } = req.params;
  try {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: "Admin privileges required"
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete poster from Cloudinary if exists
    if (event.poster) {
      const publicId = getPublicIdFromUrl(event.poster);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting Event:", error);
    res.status(500).json({ message: "Internal Server Problem" });
  }
};

// Add this new updateEvent controller
export const updateEvent = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: "Admin privileges required"
      });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const { eventId } = req.params;
    const { eventName, description, dateTime, venue } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: "Event not found" 
      });
    }

    let newPosterUrl = event.poster;

    if (req.file) {
      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'event_posters', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file.buffer);
      });

      newPosterUrl = result.secure_url;

      // Delete old image if exists
      if (event.poster) {
        const oldPublicId = getPublicIdFromUrl(event.poster);
        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId);
        }
      }
    }

    // Update event fields
    const updateFields = {
      eventName: eventName || event.eventName,
      description: description || event.description,
      venue: venue || event.venue,
      poster: newPosterUrl,
      dateTime: {
        start: dateTime?.start ? new Date(dateTime.start) : event.dateTime.start,
        end: dateTime?.end ? new Date(dateTime.end) : event.dateTime.end
      }
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true,
      message: "Event updated successfully", 
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Internal Server Error" 
    });
  }
};
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('participants', 'firstName lastName email mobile') // Optional: populate participants
      .exec();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        eventName: event.eventName,
        description: event.description,
        dateTime: event.dateTime,
        venue: event.venue,
        poster: event.poster,
        participants: event.participants,
        createdAt: event.createdAt
      }
    });

  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};