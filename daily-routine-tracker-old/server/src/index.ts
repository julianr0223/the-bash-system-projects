import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import { authRouter } from './routes/auth.js';
import { routinesRouter } from './routes/routines.js';
import { completionsRouter } from './routes/completions.js';
import { migrateRouter } from './routes/migrate.js';
import { authMiddleware } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database
initDb();

// Auth routes (public)
app.use('/api/auth', authRouter);

// Protected API routes
app.use('/api/routines', authMiddleware, routinesRouter);
app.use('/api/completions', authMiddleware, completionsRouter);
app.use('/api/migrate', authMiddleware, migrateRouter);

// Serve frontend in production
const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
