import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import dotenv from "dotenv"

dotenv.config()

// Validate Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("⚠️  WARNING: Cloudinary credentials are missing!")
  console.warn("   Please set the following environment variables in server/.env:")
  console.warn("   - CLOUDINARY_CLOUD_NAME")
  console.warn("   - CLOUDINARY_API_KEY")
  console.warn("   - CLOUDINARY_API_SECRET")
  console.warn("   Image uploads will fail until these are configured.")
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "portfolio", // Folder in Cloudinary where images will be stored
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    }
  },
})

// Create multer upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

export default cloudinary
