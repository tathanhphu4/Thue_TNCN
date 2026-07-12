/**
 * Unit Test cho middleware/auth.js
 * Nhóm 10 – TaxVN
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('Auth Middleware - protect', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('UT-AUTH-01: Không cung cấp token trong headers -> 401', async () => {
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Chưa đăng nhập'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('UT-AUTH-02: Token sai định dạng hoặc lỗi jwt.verify -> 401', async () => {
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token hết hạn hoặc không hợp lệ'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('UT-AUTH-03: Token hợp lệ nhưng không tìm thấy User tương ứng -> 401', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'user123' });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token không hợp lệ'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('UT-AUTH-04: Tài khoản hợp lệ nhưng đã bị khóa (isActive: false) -> 403', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'user123' });
    
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      isActive: false
    };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('UT-AUTH-05: Token và tài khoản hợp lệ, đang hoạt động -> Gọi next() và gán req.user', async () => {
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'user123' });
    
    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
      isActive: true,
      role: 'user'
    };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await protect(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('Auth Middleware - adminOnly', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('UT-AUTH-06: User là admin -> Gọi next()', () => {
    req.user.role = 'admin';
    
    adminOnly(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('UT-AUTH-07: User không có role admin -> 403', () => {
    req.user.role = 'user';

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Không có quyền truy cập'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('UT-AUTH-08: req.user không tồn tại -> 403', () => {
    req.user = undefined;

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
