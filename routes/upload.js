import express from 'express';
import { upload } from '../config/cloudinary.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/image', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Cloudinary returns the file info in req.file
        const imageUrl = req.file.path; // This is the Cloudinary URL
        const publicId = req.file.filename; // Cloudinary public ID

        res.status(200).json({
            url: imageUrl,
            publicId: publicId,
            secureUrl: req.file.secure_url || imageUrl,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
});

// Upload multiple images
router.post('/images', verifyToken, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }

        const uploadedImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            secureUrl: file.secure_url || file.path,
        }));

        res.status(200).json({ images: uploadedImages });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload images', error: error.message });
    }
});

export default router;
