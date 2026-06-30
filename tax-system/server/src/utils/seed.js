/**
 * Script tạo dữ liệu mẫu (chạy 1 lần)
 * Lệnh: node src/utils/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const TaxConfig = require('../models/TaxConfig');
const { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tax_system');
  console.log('Đã kết nối MongoDB');

  // Tạo tài khoản quản trị viên
  const existingAdmin = await User.findOne({ email: 'admin@taxvn.com' });
  if (!existingAdmin) {
    await User.create({
      fullName: 'Quản trị viên',
      email: 'admin@taxvn.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Đã tạo admin: admin@taxvn.com / Admin@123');
  }

  // Tạo tài khoản người dùng mẫu
  const existingUser = await User.findOne({ email: 'user@taxvn.com' });
  if (!existingUser) {
    await User.create({
      fullName: 'Nguyễn Văn A',
      email: 'user@taxvn.com',
      password: 'User@123',
      taxCode: '0123456789',
      idNumber: '001234567890',
      phone: '0912345678',
      address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    });
    console.log('Đã tạo user: user@taxvn.com / User@123');
  }

  // Tạo cấu hình thuế 2024, 2025, 2026
  const yearsToSeed = [2024, 2025, 2026];
  for (const yr of yearsToSeed) {
    const existingConfig = await TaxConfig.findOne({ year: yr });
    if (!existingConfig) {
      await TaxConfig.create({
        year: yr,
        personalDeduction: PERSONAL_DEDUCTION,
        dependentDeduction: DEPENDENT_DEDUCTION,
        taxBrackets: TAX_BRACKETS,
        isActive: true,
      });
      console.log(`Đã tạo cấu hình thuế năm ${yr}`);
    }
  }

  console.log('✅ Seed dữ liệu hoàn thành!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
