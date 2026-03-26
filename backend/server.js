const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Environment
dotenv.config();

// Define required environment variables
const REQUIRED_ENV_VARS = ['MONGO_URI', 'JWT_SECRET'];
const OPTIONAL_ENV_VARS = ['FRONTEND_URL', 'PORT'];

// Check for missing required variables
const missingEnvVars = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file or Render environment variables');
  console.error('Required: MONGO_URI, JWT_SECRET');
  console.error('Optional: FRONTEND_URL (defaults to http://localhost:3000), PORT (defaults to 4000)');
  process.exit(1);
}

// Set defaults for optional variables
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 4000;

console.log('📋 Environment variables loaded:');
console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  - PORT: ${PORT}`);
console.log(`  - FRONTEND_URL: ${FRONTEND_URL}`);
console.log(`  - MONGO_URI: ${process.env.MONGO_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`  - JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);

// Connect to Database
connectDB();

const app = express();

// CORS configuration - Handle multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed origins list
    const allowedOrigins = [
      FRONTEND_URL,
      'https://vizag-food-slots-booking.onrender.com',
      // Add your frontend Render URL here when deployed
    ];

    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging (for debugging)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip || req.socket.remoteAddress}`);
  });
  next();
});

// Health Check - Public route (no auth required)
app.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vizag Food Slot API is active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stalls', require('./routes/stallRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /status',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/auth/me',
      'GET /api/stalls',
      'GET /api/stalls/nearby',
      'GET /api/stalls/:id',
      'POST /api/stalls',
      'GET /api/bookings/user',
      'POST /api/bookings',
      'PUT /api/bookings/:id/cancel'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Set default status code
  let statusCode = error.statusCode || 500;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    error.message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    error.message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error.message = 'Token expired';
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    statusCode = 403;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : {
      name: err.name,
      stack: err.stack
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 ==================================');
  console.log(`   Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Frontend URL: ${FRONTEND_URL}`);
  console.log(`   Health check: http://localhost:${PORT}/status`);
  console.log('=====================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('❌ UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;
