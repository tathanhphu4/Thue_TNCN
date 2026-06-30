const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ── Bảo mật cơ bản ────────────────────────────────────────────────────────
app.use(helmet());

// CORS: cho phép origin từ env hoặc localhost khi development
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
    // Cho phép curl / Postman / server-to-server (không có origin)
    if (!origin) return callback(null, true);
    
    // Chuẩn hóa origin (bỏ dấu gạch chéo cuối nếu có)
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(o => o.replace(/\/$/, '') === normalizedOrigin);
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    callback(new Error(`CORS: Origin ${origin} không được phép`));
  },
  credentials: true,
}));

// Rate limiting - chỉ áp dụng cho auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 1000,         // 1 phút
  max: 10,                      // tối đa 10 lần / phút / IP
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu xác thực. Vui lòng thử lại sau 1 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Global rate limiting ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ── Logging & Parsing ──────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',    authLimiter, require('./routes/authRoutes'));
app.use('/api/users',   require('./routes/userRoutes'));
app.use('/api/tax',     require('./routes/taxRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/config',  require('./routes/configRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tax System API is running' });
});

// ── Global Error Handler ───────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // CORS error
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('[Server Error]', err.stack);
  const message = process.env.NODE_ENV === 'production'
    ? 'Lỗi server nội bộ. Vui lòng thử lại.'
    : err.message || 'Lỗi server nội bộ. Vui lòng thử lại.';
  res.status(500).json({ success: false, message });
});

// ── Connect MongoDB & Start ────────────────────────────────────────────────
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
