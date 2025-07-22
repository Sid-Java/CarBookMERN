const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import middleware
const { requestLogger, errorLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicles');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Debug: Print environment variables (without sensitive data)
console.log('Loading environment variables from:', path.join(__dirname, '.env'));
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  HAS_MONGODB_URI: !!process.env.MONGODB_URI,
  MONGODB_URI_FIRST_PART: process.env.MONGODB_URI ? process.env.MONGODB_URI.split('@')[0].substring(0, 20) + '...' : 'not set'
});

// Basic middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

// Debug logging for image requests
app.use('/', (req, res, next) => {
  if (req.url.startsWith('/images/')) {
    console.log('Image request:', req.url);
    console.log('Full path:', path.join(__dirname, req.url));
  }
  next();
});

// Serve static files
app.use('/', express.static(path.join(__dirname)));

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Database connection with retry logic
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB Atlas...');
  
  mongoose
    .connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully');
      // Start server after successful DB connection
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
        console.log(`Images directory: ${path.join(__dirname, 'images')}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      
      // More detailed error information
      if (err.name === 'MongoServerSelectionError') {
        console.log('\nTroubleshooting steps:');
        console.log('1. Check your network connection');
        console.log('2. Verify your MongoDB Atlas connection string');
        console.log('3. Make sure your IP is whitelisted in MongoDB Atlas');
        console.log('4. Check if your MongoDB Atlas user credentials are correct');
        console.log('5. Ensure your MongoDB Atlas cluster is running');
      }
      
      console.log('\nRetrying connection in 5 seconds...\n');
      setTimeout(connectWithRetry, 5000);
    });
};

// Initial database connection attempt
connectWithRetry();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
