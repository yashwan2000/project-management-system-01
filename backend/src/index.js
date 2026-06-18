import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import dashboardRoutes from './routes/dashboard.js';
import { verifyToken } from './middlewares/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve built frontend (if exists)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
// Fallback to index.html for client‑side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return; // let API routes handle
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/projects', verifyToken, projectRoutes);
app.use('/api/tasks', verifyToken, taskRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
