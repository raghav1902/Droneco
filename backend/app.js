/**
 * @file app.js
 * @description Application entry point for the Coaching Institute Lead Management System.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { errorHandler } = require('./middleware/errorHandler/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./database/connection');
connectDB();

// Initialize Express app
const app = express();

// Security Headers
app.use(helmet());

// Global Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Restrict to frontend origin
  credentials: true,               // Support cookies/auth headers if needed
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Sanitize data (prevent NoSQL injection)
app.use(mongoSanitize());

// General Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Strict Rate Limiting for Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 failed login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});
app.use('/api/auth/login', loginLimiter);

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date(), phase: 'In-Memory Development' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/discounts', require('./routes/discountRoutes'));

// 404 Route handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` SERVER RUNNING IN ${process.env.NODE_ENV || 'development'} MODE`);
  console.log(` Port: ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(`=============================================`);
});

module.exports = app;
