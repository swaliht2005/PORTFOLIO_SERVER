import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

import seedAdmin from './seed.js';

// ...

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.log(err));
