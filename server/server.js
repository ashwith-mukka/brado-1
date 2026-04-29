import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import path from 'path';


dotenv.config();

// Connect to database
connectDB();

const app = express();


// ── CORS ──────────────────────────────────────────────────────────────────────
// In production, only allow requests from your deployed frontend domain.
// Set ALLOWED_ORIGINS in your Render env vars as a comma-separated list.
// e.g. ALLOWED_ORIGINS=https://your-app.vercel.app
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

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

// ── DEPLOYMENT ──────────────────────────────────────────────────────────────
const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // If running from the 'server' directory, go up one level to find 'client'
  const clientPath = path.join(__dirname, '..', 'client', 'dist');
  
  app.use(express.static(clientPath));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(clientPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
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
