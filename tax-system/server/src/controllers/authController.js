const { body, validationResult } = require('express-validator');
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.validateRegister = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Vui lòng nhập họ và tên')
    .isLength({ min: 2 }).withMessage('Họ tên phải có ít nhất 2 ký tự'),

  body('email')
    .trim()
    .notEmpty().withMessage('Vui lòng nhập email')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Vui lòng nhập mật khẩu')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),

  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^(0[3|5|7|8|9])[0-9]{8}$/).withMessage('Số điện thoại không hợp lệ'),

  body('idCard')
    .trim()
    .notEmpty().withMessage('Vui lòng nhập số CCCD')
    .matches(/^\d{9}$|^\d{12}$/).withMessage('CCCD phải có 9 hoặc 12 chữ số'),

  body('taxCode')
    .optional({ checkFalsy: true })
    .matches(/^\d{10}$|^\d{13}$/).withMessage('Mã số thuế phải có 10 hoặc 13 chữ số'),
];

exports.validateLogin = [
  body('email').trim().notEmpty().withMessage('Vui lòng nhập email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu'),
];

const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg);
    res.status(400).json({ success: false, message: messages[0], errors: messages });
    return false;
  }
  return true;
};

exports.register = async (req, res) => {
  if (!checkValidation(req, res)) return;
  try {
    const { fullName, email, password, phone, idCard, taxCode } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email này đã được đăng ký. Vui lòng dùng email khác.' });

    const existingCCCD = await User.findOne({ idNumber: idCard });
    if (existingCCCD) return res.status(400).json({ success: false, message: 'Số CCCD này đã được đăng ký trong hệ thống.' });

    const user = await User.create({ fullName, email, password, phone, idNumber: idCard, taxCode });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        idNumber: user.idNumber,
        taxCode: user.taxCode,
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === 'idNumber') {
        return res.status(400).json({ success: false, message: 'Số CCCD này đã được đăng ký trong hệ thống.' });
      }
      return res.status(400).json({ success: false, message: 'Email hoặc CCCD đã tồn tại trong hệ thống.' });
    }
    res.status(500).json({ success: false, message: 'Lỗi đăng ký. Vui lòng thử lại.' });
  }
};

exports.login = async (req, res) => {
  if (!checkValidation(req, res)) return;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.' });

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        idNumber: user.idNumber,
        taxCode: user.taxCode,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi đăng nhập. Vui lòng thử lại.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy thông tin người dùng.' });
  }
};
