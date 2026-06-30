const jwt = require('jsonwebtoken');
const { register, login, getMe } = require('../../src/controllers/authController');

jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');
jest.mock('express-validator', () => {
  const actual = jest.requireActual('express-validator');
  return {
    ...actual,
    validationResult: jest.fn(),
  };
});

const User = require('../../src/models/User');
const { validationResult } = require('express-validator');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '7d';
    req = { body: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
    });

    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email is required' }],
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
      }));
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        fullName: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        idCard: '123456789012',
      };
      User.findOne.mockResolvedValueOnce({ email: 'test@test.com' }); // email exists

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
      }));
    });

    it('should return 400 if CCCD already exists', async () => {
      req.body = {
        fullName: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        idCard: '123456789012',
      };
      User.findOne
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce({ idNumber: '123456789012' }); // CCCD exists

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
      }));
    });

    it('should create user and return token on success', async () => {
      req.body = {
        fullName: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        phone: '0901234567',
        idCard: '123456789012',
        taxCode: '1234567890',
      };
      User.findOne.mockResolvedValue(null);
      const mockUser = {
        _id: 'user123',
        fullName: 'Test User',
        email: 'test@test.com',
        role: 'user',
        idNumber: '123456789012',
        taxCode: '1234567890',
      };
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        token: 'mock-token',
        user: expect.objectContaining({ email: 'test@test.com' }),
      }));
    });

    it('should handle duplicate key error (code 11000) for idNumber', async () => {
      req.body = {
        fullName: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        idCard: '123456789012',
      };
      User.findOne.mockResolvedValue(null);
      const duplicateError = new Error('duplicate key');
      duplicateError.code = 11000;
      duplicateError.keyPattern = { idNumber: 1 };
      User.create.mockRejectedValue(duplicateError);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle generic server error', async () => {
      req.body = {
        fullName: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        idCard: '123456789012',
      };
      User.findOne.mockResolvedValue(null);
      User.create.mockRejectedValue(new Error('DB connection failed'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
    });

    it('should return 400 if validation fails', async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email is required' }],
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 if user not found', async () => {
      req.body = { email: 'notfound@test.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 401 if password is incorrect', async () => {
      req.body = { email: 'test@test.com', password: 'wrongpassword' };
      const mockUser = {
        _id: 'user123',
        email: 'test@test.com',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 403 if user account is locked', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const mockUser = {
        _id: 'user123',
        email: 'test@test.com',
        isActive: false,
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return token and user data on successful login', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      const mockUser = {
        _id: 'user123',
        fullName: 'Test User',
        email: 'test@test.com',
        role: 'user',
        idNumber: '123456789012',
        taxCode: '1234567890',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        token: 'mock-token',
        user: expect.objectContaining({
          id: 'user123',
          email: 'test@test.com',
        }),
      }));
    });

    it('should return 500 on server error', async () => {
      req.body = { email: 'test@test.com', password: 'password123' };
      User.findOne.mockRejectedValue(new Error('DB error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getMe', () => {
    it('should return current user without password', async () => {
      const mockUser = { _id: 'user123', email: 'test@test.com', fullName: 'Test' };
      req.user = { _id: 'user123' };
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await getMe(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, user: mockUser });
    });

    it('should return 500 on error', async () => {
      req.user = { _id: 'user123' };
      User.findById.mockReturnValue({ select: jest.fn().mockRejectedValue(new Error('DB error')) });

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
