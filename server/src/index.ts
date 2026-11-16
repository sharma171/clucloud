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
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

app.use('/api/users', usersRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints available:`);
  console.log(`   - GET http://localhost:${PORT}/api/users?offset=0&limit=50`);
  console.log(`   - GET http://localhost:${PORT}/health`);
});
