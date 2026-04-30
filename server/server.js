import express from 'express';
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
  : ['http://localhost:5173', 'http://localhost:3000', 'https://brado-1.vercel.app'];


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

if (process.env.NODE_ENV === 'production' && fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(clientPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><title>Brado API</title></head>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h1>API is running...</h1>
        <p>Status: <strong>Backend Online</strong></p>
        <p>Environment: <strong>${process.env.NODE_ENV}</strong></p>
        <p>Static Path: <code>${clientPath}</code></p>
        <p>Static Exists: <strong>${fs.existsSync(clientPath)}</strong></p>
        <hr/>
        <p>If you see this instead of the app, ensure you have run <code>npm run build</code> and that the <code>dist</code> folder is in the correct location.</p>
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
