import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Request logging for API telemetry
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api') || req.path.startsWith('/users')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount routes on both /api/users and /users so rewrites always match regardless of prefix preservation
app.use('/api/users', usersRouter);
app.use('/users', usersRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: '50k-users-api', timestamp: new Date().toISOString() });
});

// CRITICAL FOR VERCEL: Only listen when running locally, not in serverless runtime
if (!process.env.VERCEL && !process.env.NOW_REGION) {
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
    console.log(`📡 Endpoints available:`);
    console.log(`   - GET http://localhost:${PORT}/api/users?offset=0&limit=100`);
    console.log(`   - GET http://localhost:${PORT}/api/users/filters`);
    console.log(`   - GET http://localhost:${PORT}/health`);
  });
}

export default app;
export { app };
