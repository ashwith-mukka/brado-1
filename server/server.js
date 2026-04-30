import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global Error Handlers for Production Stability
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});



dotenv.config();

// Connect to database
connectDB();

const app = express();

// Request Logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${req.headers.origin || 'No Origin'}`);
  next();
});


// Manual CORS fallback for extra safety
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

console.log('Server initializing...');

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'https://brado-1.onrender.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);


// ── DEPLOYMENT ──────────────────────────────────────────────────────────────

const possiblePaths = [
  path.join(__dirname, '..', 'client', 'dist'),
  path.join(__dirname, 'client', 'dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.join(process.cwd(), 'client', 'dist'),
];

let clientPath = possiblePaths[0];
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    clientPath = p;
    break;
  }
}

// Serve static files if we are in production OR if the dist folder was found (Self-healing logic)
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

if (isProduction && fs.existsSync(clientPath)) {
  console.log(`Serving static files from: ${clientPath}`);
  app.use(express.static(clientPath));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(clientPath, 'index.html'))
  );
} else {
  // Debug Fallback Route
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Brado API | Debug</title>
        <style>
          body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; padding: 2rem; color: #333; background: #f8fafc; }
          .card { background: white; padding: 2rem; border-radius: 1rem; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 600px; margin: 0 auto; }
          code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
          .status { font-weight: bold; color: #16a34a; }
          .warning { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 Brado API Online</h1>
          <p>Status: <span class="status">Backend Healthy</span></p>
          <hr/>
          <p><strong>Environment Info:</strong></p>
          <ul>
            <li>Node Version: <code>${process.version}</code></li>
            <li>Environment: <code>${process.env.NODE_ENV || 'not set'}</code></li>
            <li>Database Status: <code class="${mongoose.connection.readyState === 1 ? 'status' : 'warning'}">
              ${['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][mongoose.connection.readyState]}
            </code></li>
            <li>Static Path: <code>${clientPath}</code></li>
            <li>Static Folder Exists: <code class="${fs.existsSync(clientPath) ? 'status' : 'warning'}">${fs.existsSync(clientPath)}</code></li>
          </ul>
          <p class="warning">Notice: If you see this page, please set <code>NODE_ENV=production</code> in your Render dashboard.</p>
        </div>
      </body>
      </html>
    `);
  });
}





// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


// ── START SERVER ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
