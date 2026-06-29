const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, idNumber } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

    const user = await User.create({ fullName, email, password, phone, idNumber });
    const token = signToken(user._id);

    res.status(201).json({ success: true, token, user: { id: user._id, fullName, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa' });

    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, fullName: user.fullName, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
