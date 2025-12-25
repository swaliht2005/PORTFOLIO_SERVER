import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Register/Seed Admin (Use once or protect)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            email: 'admin@example.com',
            bio: 'Creative Director & Developer',
            avatar: ''
        });

        await newUser.save();
        res.json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Fallback for legacy .env auth if DB is empty (optional, but good for transition)
        // Check DB first
        const user = await User.findOne({ username });
        
        if (!user) {
            // Check legacy env vars if user not found in DB
            if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
                // Should we auto-migrate? Maybe just allow login for now.
                const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
                return res.json({ token, username });
            }
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username, avatar: user.avatar });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Public Admin Profile
router.get('/admin-profile', async (req, res) => {
    try {
        const user = await User.findOne();
        if (!user) return res.status(404).json({ message: 'No admin found' });
        
        // Return only necessary public info
        res.json({
            username: user.username,
            avatar: user.avatar,
            bio: user.bio
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Profile
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // if legacy token (no id), return basic info
        if (!decoded.id && decoded.username) {
             return res.json({ username: decoded.username, bio: 'Legacy Admin', avatar: '', isLegacy: true });
        }

        const user = await User.findById(decoded.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update Profile
router.put('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) return res.status(400).json({ message: 'Legacy users cannot update profile. Please re-register.' });

        const updates = req.body;
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(decoded.id, { $set: updates }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
