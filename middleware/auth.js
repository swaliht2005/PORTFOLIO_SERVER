import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logPath = path.join(__dirname, '..', '..', '.cursor', 'debug.log');

export const verifyToken = (req, res, next) => {
    // #region agent log
    try { fs.appendFileSync(logPath, JSON.stringify({location:'auth.js:4',message:'verifyToken entry',data:{hasAuthHeader:!!req.headers.authorization,hasAuthHeaderAlt:!!req.header('Authorization'),path:req.path},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n'); } catch(e) {}
    // #endregion
    try {
        const authHeader = req.headers.authorization || req.header('Authorization');
        if (!authHeader) {
            // #region agent log
            try { fs.appendFileSync(logPath, JSON.stringify({location:'auth.js:7',message:'No auth header',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n'); } catch(e) {}
            // #endregion
            return res.status(401).json({ message: 'Access Denied - No token provided' });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(" ")[1] 
            : authHeader;

        if (!token) {
            // #region agent log
            try { fs.appendFileSync(logPath, JSON.stringify({location:'auth.js:15',message:'Invalid token format',data:{authHeaderPrefix:authHeader.substring(0,20)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n'); } catch(e) {}
            // #endregion
            return res.status(401).json({ message: 'Access Denied - Invalid token format' });
        }

        if (!process.env.JWT_SECRET) {
            // #region agent log
            try { fs.appendFileSync(logPath, JSON.stringify({location:'auth.js:20',message:'JWT_SECRET missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n'); } catch(e) {}
            // #endregion
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // #region agent log
        try { fs.appendFileSync(logPath, JSON.stringify({location:'auth.js:25',message:'Token verified successfully',data:{userId:verified?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n'); } catch(e) {}
        // #endregion
        req.user = verified;
        next();
    } catch (err) {
        // #region agent log
        try { fs.appendFileSync(logPath, JSON.stringify({location:'auth.js:27',message:'Token verification error',data:{errorName:err.name,errorMessage:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})+'\n'); } catch(e) {}
        // #endregion
        console.error('Token verification error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Token verification failed' });
    }
};
