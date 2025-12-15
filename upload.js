import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_uploads',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const parser = multer({ storage: storage });

// POST /api/upload
router.post('/', parser.single('image'), (req, res) => {
  res.status(200).json({ imageUrl: req.file.path });
});

export default router;