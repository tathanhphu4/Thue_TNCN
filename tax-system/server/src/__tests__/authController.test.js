/**
 * Unit Test cho controllers/authController.js
 * Nhóm 10 – TaxVN
 */

const { register, login, getMe } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Mock dependencies
jest.mock('../models/User');
jest.mock('jsonwebtoken');
jest.mock('express-validator', () => {
  const chain = () => {
    const mock = {
      trim: jest.fn(() => mock),
      notEmpty: jest.fn(() => mock),
      isLength: jest.fn(() => mock),
      isEmail: jest.fn(() => mock),
      normalizeEmail: jest.fn(() => mock),
      optional: jest.fn(() => mock),
      matches: jest.fn(() => mock),
      withMessage: jest.fn(() => mock)
    };
    return mock;
  };
  return {
    body: jest.fn(chain),
    validationResult: jest.fn()
  };
});

describe('Auth Controller - register', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        fullName: 'Nguyen Van A',
        email: 'a@taxvn.com',
        password: 'Password123',
        phone: '0901234567',
        idCard: '123456789',
        taxCode: '1234567890'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    process.env.JWT_SECRET = 'test-secret';
    jest.clearAllMocks();
  });

  test('UT-REG-01: Validation lỗi -> Trả về 400', async () => {
    // Mock validationResult return errors
    const mockErrors = {
      isEmpty: () => false,
      array: () => [{ msg: 'Email không hợp lệ' }]
    };
    validationResult.mockReturnValue(mockErrors);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email không hợp lệ',
      errors: ['Email không hợp lệ']
    });
  });

  test('UT-REG-02: Email đã tồn tại -> Trả về 400', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValueOnce({ email: 'a@taxvn.com' }); // Find email match

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'a@taxvn.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email này đã được đăng ký. Vui lòng dùng email khác.'
    });
  });

  test('UT-REG-03: Số CCCD đã tồn tại -> Trả về 400', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne
      .mockResolvedValueOnce(null) // Email check passes
      .mockResolvedValueOnce({ idNumber: '123456789' }); // CCCD check finds user

    await register(req, res);

    expect(User.findOne).toHaveBeenNthCalledWith(1, { email: 'a@taxvn.com' });
    expect(User.findOne).toHaveBeenNthCalledWith(2, { idNumber: '123456789' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Số CCCD này đã được đăng ký trong hệ thống.'
    });
  });

  test('UT-REG-04: Đăng ký thành công -> Tạo user, ký JWT và trả về 201', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue(null); // Unique check passes
    
    const mockCreatedUser = {
      _id: 'userid123',
      fullName: 'Nguyen Van A',
      email: 'a@taxvn.com',
      role: 'user',
      idNumber: '123456789',
      taxCode: '1234567890'
    };
    User.create.mockResolvedValue(mockCreatedUser);
    jwt.sign.mockReturnValue('mock-token');

    await register(req, res);

    expect(User.create).toHaveBeenCalledWith({
      fullName: 'Nguyen Van A',
      email: 'a@taxvn.com',
      password: 'Password123',
      phone: '0901234567',
      idNumber: '123456789',
      taxCode: '1234567890'
    });
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: 'mock-token',
      user: {
        id: 'userid123',
        fullName: 'Nguyen Van A',
        email: 'a@taxvn.com',
        role: 'user',
        idNumber: '123456789',
        taxCode: '1234567890'
      }
    });
  });

  test('UT-REG-05: Lỗi DB trùng khóa idNumber khi create (mức db) -> Trả về 400', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue(null);
    
    const duplicateError = new Error('Duplicate key error');
    duplicateError.code = 11000;
    duplicateError.keyPattern = { idNumber: 1 };
    User.create.mockRejectedValue(duplicateError);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Số CCCD này đã được đăng ký trong hệ thống.'
    });
  });

  test('UT-REG-06: Lỗi hệ thống bất kỳ lúc tạo -> Trả về 500', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue(null);
    User.create.mockRejectedValue(new Error('System error'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Lỗi đăng ký. Vui lòng thử lại.'
    });
  });
});

describe('Auth Controller - login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@taxvn.com',
        password: 'Password123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('UT-LGN-01: Validation lỗi -> Trả về 400', async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Mật khẩu là bắt buộc' }]
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Mật khẩu là bắt buộc',
      errors: ['Mật khẩu là bắt buộc']
    });
  });

  test('UT-LGN-02: Không tìm thấy email trong hệ thống -> Trả về 401', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    });
  });

  test('UT-LGN-03: Mật khẩu không trùng khớp -> Trả về 401', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(false)
    };
    User.findOne.mockResolvedValue(mockUser);

    await login(req, res);

    expect(mockUser.comparePassword).toHaveBeenCalledWith('Password123');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    });
  });

  test('UT-LGN-04: Tài khoản bị khóa (isActive: false) -> Trả về 403', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(true),
      isActive: false
    };
    User.findOne.mockResolvedValue(mockUser);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'
    });
  });

  test('UT-LGN-05: Đăng nhập thành công -> Trả về 200 và token', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    const mockUser = {
      _id: 'userid123',
      fullName: ' Nguyen Van A',
      email: 'test@taxvn.com',
      role: 'user',
      idNumber: '123456789',
      taxCode: '1234567890',
      isActive: true,
      comparePassword: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue('mock-token');

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: 'mock-token',
      user: {
        id: 'userid123',
        fullName: ' Nguyen Van A',
        email: 'test@taxvn.com',
        role: 'user',
        idNumber: '123456789',
        taxCode: '1234567890'
      }
    });
  });

  test('UT-LGN-06: Lỗi DB khi login -> Trả về 500', async () => {
    validationResult.mockReturnValue({ isEmpty: () => true });
    User.findOne.mockRejectedValue(new Error('DB Error'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Lỗi đăng nhập. Vui lòng thử lại.'
    });
  });
});

describe('Auth Controller - getMe', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: 'userid123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('UT-GETME-01: Lấy thông tin user hiện tại thành công', async () => {
    const mockUser = { _id: 'userid123', fullName: 'Nguyen Van A', email: 'test@taxvn.com' };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await getMe(req, res);

    expect(User.findById).toHaveBeenCalledWith('userid123');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: mockUser
    });
  });

  test('UT-GETME-02: Lỗi hệ thống -> Trả về 500', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error('System error'))
    });

    await getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Lỗi lấy thông tin người dùng.'
    });
  });
});
