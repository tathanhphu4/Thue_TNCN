/**
 * Script tao du lieu mau (chay 1 lan)
 * Lenh: node src/utils/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const TaxConfig = require('../models/TaxConfig');
const { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tax_system');
  console.log('Connected to MongoDB');

  // Tao admin
  const existingAdmin = await User.findOne({ email: 'admin@taxvn.com' });
  if (!existingAdmin) {
    await User.create({
      fullName: 'Quan tri vien',
      email: 'admin@taxvn.com',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Admin created: admin@taxvn.com / Admin@123');
  }

  // Tao user mau
  const existingUser = await User.findOne({ email: 'user@taxvn.com' });
  if (!existingUser) {
    await User.create({
      fullName: 'Nguyen Van A',
      email: 'user@taxvn.com',
      password: 'User@123',
      taxCode: 'MST001234567',
      idNumber: '001234567890',
    });
    console.log('User created: user@taxvn.com / User@123');
  }

  // Tao cau hinh thue 2024
  const existingConfig = await TaxConfig.findOne({ year: 2024 });
  if (!existingConfig) {
    await TaxConfig.create({
      year: 2024,
      personalDeduction: PERSONAL_DEDUCTION,
      dependentDeduction: DEPENDENT_DEDUCTION,
      taxBrackets: TAX_BRACKETS,
    });
    console.log('TaxConfig 2024 created');
  }

  console.log('Seed hoan thanh!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
