
import express from "express"
import { upload } from "../config/cloudinary.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

// Single image upload
router.post("/image", verifyToken, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Cloudinary automatically uploads and returns the URL
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ message: "Failed to upload image", error: error.message })
  }
})

// Multiple images upload (for gallery)
router.post("/images", verifyToken, upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" })
    }

    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }))

    res.json({ images: uploadedImages })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ message: "Failed to upload images", error: error.message })
  }
})

export default router
