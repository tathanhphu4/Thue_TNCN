const jwt = require('jsonwebtoken');
const { protect, adminOnly } = require('../../src/middleware/auth');

jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

const User = require('../../src/models/User');

describe('auth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect', () => {
    it('should return 401 if no authorization header', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header has no token', async () => {
      req.headers.authorization = 'Bearer ';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation(() => { throw new Error('invalid token'); });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found in DB', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user account is locked', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ id: 'user123' });
      const mockUser = { _id: 'user123', email: 'test@test.com', isActive: false };
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next and attach user to req on valid token', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ id: 'user123' });
      const mockUser = { _id: 'user123', email: 'test@test.com', isActive: true };
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await protect(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next for user with isActive undefined (default active)', async () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ id: 'user123' });
      const mockUser = { _id: 'user123', email: 'test@test.com' };
      User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await protect(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('adminOnly', () => {
    it('should return 403 if user is not admin', () => {
      req.user = { role: 'user' };

      adminOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.any(String),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      req.user = { role: 'admin' };

      adminOnly(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if req.user is undefined', () => {
      req.user = undefined;

      adminOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if req.user is null', () => {
      req.user = null;

      adminOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
