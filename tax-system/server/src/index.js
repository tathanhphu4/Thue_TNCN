const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000'
    ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, '') === normalizedOrigin);
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS: Origin ${origin} không được phép`));
  },
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu xác thực. Vui lòng thử lại sau 1 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',    authLimiter, require('./routes/authRoutes'));
app.use('/api/users',   require('./routes/userRoutes'));
app.use('/api/tax',     require('./routes/taxRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/config',  require('./routes/configRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tax System API is running' });
});

app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('[Server Error]', err.stack);
  res.status(500).json({ success: false, message: 'Lỗi server nội bộ. Vui lòng thử lại.' });
});

const PORT       = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tax_system';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📝 Allowed origins: ${allowedOrigins.join(', ')}`);
      }
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });
