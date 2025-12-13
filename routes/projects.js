import express from 'express';
import Project from '../models/Project.js';
import { verifyToken } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.join(__dirname, '..', '..', '.cursor', 'debug.log');

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create project (Admin only)
router.post('/', verifyToken, async (req, res) => {
    // #region agent log
    try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:18',message:'POST /api/projects entry',data:{hasBody:!!req.body,bodyKeys:Object.keys(req.body||{}),title:req.body?.title,thumbnailUrl:req.body?.thumbnailUrl,hasAuth:!!req.headers.authorization},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})+'\n'); } catch(e) {}
    // #endregion
    try {
        console.log('Creating project - Request received');
        console.log('Request body keys:', Object.keys(req.body || {}));
        console.log('Title:', req.body?.title);
        console.log('ThumbnailUrl:', req.body?.thumbnailUrl ? 'Present' : 'Missing');
        
        // Validate required fields
        if (!req.body || !req.body.title || req.body.title.trim() === '') {
            // #region agent log
            try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:27',message:'Validation failed - title missing',data:{hasBody:!!req.body,title:req.body?.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n'); } catch(e) {}
            // #endregion
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!req.body.thumbnailUrl || req.body.thumbnailUrl.trim() === '') {
            // #region agent log
            try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:30',message:'Validation failed - thumbnailUrl missing',data:{thumbnailUrl:req.body?.thumbnailUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n'); } catch(e) {}
            // #endregion
            return res.status(400).json({ message: 'Thumbnail URL is required' });
        }

        // Clean up images array - remove invalid entries
        const cleanedData = { ...req.body };
        if (cleanedData.images && Array.isArray(cleanedData.images)) {
            cleanedData.images = cleanedData.images.filter(img => img && img.url && img.url.trim() !== '');
        } else {
            cleanedData.images = [];
        }

        // Ensure arrays are properly formatted
        if (!Array.isArray(cleanedData.tags)) {
            cleanedData.tags = [];
        }
        if (!Array.isArray(cleanedData.tools)) {
            cleanedData.tools = [];
        }
        if (!Array.isArray(cleanedData.contentModules)) {
            cleanedData.contentModules = [];
        }

        // #region agent log
        try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:52',message:'Before Project creation',data:{cleanedDataKeys:Object.keys(cleanedData),imagesCount:cleanedData.images?.length,imagesStructure:cleanedData.images?.map(i=>({hasUrl:!!i.url,urlType:typeof i.url}))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})+'\n'); } catch(e) {}
        // #endregion
        console.log('Creating project with cleaned data...');
        const project = new Project(cleanedData);
        const newProject = await project.save();
        // #region agent log
        try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:55',message:'Project saved successfully',data:{projectId:newProject._id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n'); } catch(e) {}
        // #endregion
        console.log('Project created successfully:', newProject._id);
        res.status(201).json(newProject);
    } catch (err) {
        // #region agent log
        try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:57',message:'Error in POST handler',data:{errorName:err.name,errorMessage:err.message,isValidationError:err.name==='ValidationError',validationErrors:err.name==='ValidationError'?Object.values(err.errors||{}).map(e=>e.message):null,errorStack:err.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})+'\n'); } catch(e) {}
        // #endregion
        console.error('Error creating project:', err);
        console.error('Error name:', err.name);
        console.error('Error stack:', err.stack);
        
        // Extract validation error messages
        let errorMessage = err.message || 'Failed to create project';
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors || {}).map(e => e.message).join(', ');
            errorMessage = validationErrors || errorMessage;
        } else if (err.name === 'MongoServerError') {
            errorMessage = 'Database error: ' + err.message;
        }
        
        // Return 400 for validation errors, 500 for server errors
        const statusCode = err.name === 'ValidationError' ? 400 : 500;
        // #region agent log
        try { fs.appendFileSync(logPath, JSON.stringify({location:'projects.js:73',message:'Sending error response',data:{statusCode,errorMessage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})+'\n'); } catch(e) {}
        // #endregion
        res.status(statusCode).json({ message: errorMessage });
    }
});

// Update project
router.put('/:id', verifyToken, async (req, res) => {
    try {
        console.log('Updating project:', req.params.id);
        console.log('Update data:', JSON.stringify(req.body, null, 2));
        
        // Find project
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Update fields - only update if provided
        if (req.body.title !== undefined) project.title = req.body.title;
        if (req.body.description !== undefined) project.description = req.body.description;
        if (req.body.imageUrl !== undefined) project.imageUrl = req.body.imageUrl;
        if (req.body.thumbnailUrl !== undefined) project.thumbnailUrl = req.body.thumbnailUrl;
        if (req.body.liveLink !== undefined) project.liveLink = req.body.liveLink;
        if (req.body.repoLink !== undefined) project.repoLink = req.body.repoLink;
        if (req.body.tags !== undefined) project.tags = req.body.tags;
        if (req.body.category !== undefined) project.category = req.body.category;
        if (req.body.tools !== undefined) project.tools = req.body.tools;
        if (req.body.client !== undefined) project.client = req.body.client;
        if (req.body.year !== undefined) project.year = req.body.year;
        if (req.body.role !== undefined) project.role = req.body.role;
        if (req.body.status !== undefined) project.status = req.body.status;
        if (req.body.images !== undefined) project.images = req.body.images;
        if (req.body.contentModules !== undefined) project.contentModules = req.body.contentModules;

        const updatedProject = await project.save();
        console.log('Project updated successfully');
        res.json(updatedProject);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(400).json({ message: err.message || 'Failed to update project' });
    }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
