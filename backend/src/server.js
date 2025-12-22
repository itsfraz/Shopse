const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Backward compatibility / Default for JWT Secrets
if (!process.env.JWT_ACCESS_SECRET) {
    console.warn("WARNING: JWT_ACCESS_SECRET not found in .env, using JWT_SECRET or default.");
    process.env.JWT_ACCESS_SECRET = process.env.JWT_SECRET || 'fallback_access_secret_dev_only';
}
if (!process.env.JWT_REFRESH_SECRET) {
    console.warn("WARNING: JWT_REFRESH_SECRET not found in .env, using default.");
    process.env.JWT_REFRESH_SECRET = process.env.JWT_SECRET || 'fallback_refresh_secret_dev_only';
}

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Global Middleware
app.use(cors({
    origin: true, // Allow all origins for development
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Socket.IO Setup
const io = require('socket.io')(server, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.set('io', io); // Make io accessible in controllers
