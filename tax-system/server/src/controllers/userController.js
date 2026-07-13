const User = require('../models/User');
const { handleControllerError } = require('../utils/errorHelpers');

// GET /api/users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi lấy danh sách người dùng.');
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    // Chỉ cho phép cập nhật các trường an toàn, KHÔNG bao gồm idNumber và taxCode
    const { fullName, phone, address, dateOfBirth } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, address, dateOfBirth },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi cập nhật hồ sơ.');
  }
};

// PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi đổi mật khẩu.');
  }
};

// PUT /api/users/:id/toggle-status (admin: khóa/mở khóa tài khoản)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Không thể khóa tài khoản quản trị viên' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `${user.isActive ? 'Mở khóa' : 'Khóa'} tài khoản thành công`,
      data: { _id: user._id, fullName: user.fullName, email: user.email, isActive: user.isActive }
    });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi thay đổi trạng thái người dùng.');
  }
};
