const { getAllUsers, updateProfile, changePassword, toggleUserStatus } = require('../../src/controllers/userController');

jest.mock('../../src/models/User');

const User = require('../../src/models/User');

describe('userController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, user: { _id: 'user123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all non-admin users', async () => {
      const mockUsers = [
        { _id: 'u1', fullName: 'User 1', role: 'user' },
        { _id: 'u2', fullName: 'User 2', role: 'user' },
      ];
      User.find.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUsers) });

      await getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'user' });
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUsers });
    });

    it('should return 500 on error', async () => {
      User.find.mockReturnValue({ select: jest.fn().mockRejectedValue(new Error('DB error')) });

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateProfile', () => {
    it('should update allowed fields only', async () => {
      req.body = {
        fullName: 'Updated Name',
        phone: '0901111111',
        address: '123 Street',
        dateOfBirth: '1990-01-01',
        idNumber: 'should-be-ignored', // should not be updated
      };
      const mockUser = { _id: 'user123', fullName: 'Updated Name' };
      User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

      await updateProfile(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { fullName: 'Updated Name', phone: '0901111111', address: '123 Street', dateOfBirth: '1990-01-01' },
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUser });
    });

    it('should return 500 on error', async () => {
      req.body = { fullName: 'Test' };
      User.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockRejectedValue(new Error('DB error')) });

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('changePassword', () => {
    it('should return 400 if currentPassword or newPassword missing', async () => {
      req.body = { currentPassword: 'old' };

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if only newPassword provided', async () => {
      req.body = { newPassword: 'newpass123' };

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      req.body = { currentPassword: 'old123', newPassword: 'new123' };
      User.findById.mockResolvedValue(null);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if current password is wrong', async () => {
      req.body = { currentPassword: 'wrong', newPassword: 'new123' };
      User.findById.mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if new password too short', async () => {
      req.body = { currentPassword: 'correct', newPassword: '12345' };
      User.findById.mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(true),
      });

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should change password successfully', async () => {
      req.body = { currentPassword: 'correct', newPassword: 'newpass123' };
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      await changePassword(req, res);

      expect(mockUser.password).toBe('newpass123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
      }));
    });

    it('should return 500 on server error', async () => {
      req.body = { currentPassword: 'correct', newPassword: 'newpass123' };
      User.findById.mockRejectedValue(new Error('DB error'));

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('toggleUserStatus', () => {
    it('should return 404 if user not found', async () => {
      req.params.id = 'nonexistent';
      User.findById.mockResolvedValue(null);

      await toggleUserStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if trying to lock an admin', async () => {
      req.params.id = 'admin123';
      User.findById.mockResolvedValue({ _id: 'admin123', role: 'admin' });

      await toggleUserStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should toggle active to inactive', async () => {
      req.params.id = 'user456';
      const mockUser = {
        _id: 'user456',
        fullName: 'Test User',
        email: 'test@test.com',
        role: 'user',
        isActive: true,
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      await toggleUserStatus(req, res);

      expect(mockUser.isActive).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ isActive: false }),
      }));
    });

    it('should toggle inactive to active', async () => {
      req.params.id = 'user456';
      const mockUser = {
        _id: 'user456',
        fullName: 'Test User',
        email: 'test@test.com',
        role: 'user',
        isActive: false,
        save: jest.fn().mockResolvedValue(true),
      };
      User.findById.mockResolvedValue(mockUser);

      await toggleUserStatus(req, res);

      expect(mockUser.isActive).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 500 on server error', async () => {
      req.params.id = 'user456';
      User.findById.mockRejectedValue(new Error('DB error'));

      await toggleUserStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
