/**
 * Script tạo dữ liệu mẫu (chạy 1 lần)
 * Lệnh: node src/utils/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const TaxConfig = require('../models/TaxConfig');
const TaxDeclaration = require('../models/TaxDeclaration');
const Payment = require('../models/Payment');
const { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

const SEED_YEAR = 2025;

// ---- 10 người dùng mẫu, kèm hồ sơ thu nhập/giảm trừ riêng ----
const sampleUsers = [
  {
    fullName: 'Nguyễn Văn A', email: 'user1@taxvn.com', password: 'User@123',
    taxCode: '0123456781', idNumber: '001234567891', phone: '0912345671',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    dependents: 1,
    incomes: [{ source: 'salary', description: 'Lương tháng', amount: 25000000 * 12 }],
    extraDeductions: [{ type: 'insurance', description: 'BHXH/BHYT/BHTN', amount: 1500000 * 12 }],
  },
  {
    fullName: 'Trần Thị B', email: 'user2@taxvn.com', password: 'User@123',
    taxCode: '0123456782', idNumber: '001234567892', phone: '0912345672',
    address: '45 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    dependents: 0,
    incomes: [{ source: 'salary', description: 'Lương tháng', amount: 18000000 * 12 }],
    extraDeductions: [],
  },
  {
    fullName: 'Lê Văn C', email: 'user3@taxvn.com', password: 'User@123',
    taxCode: '0123456783', idNumber: '001234567893', phone: '0912345673',
    address: '78 Đường Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP. Hồ Chí Minh',
    dependents: 2,
    incomes: [
      { source: 'salary', description: 'Lương tháng', amount: 30000000 * 12 },
      { source: 'business', description: 'Thu nhập kinh doanh thêm', amount: 50000000 },
    ],
    extraDeductions: [{ type: 'insurance', description: 'BHXH/BHYT/BHTN', amount: 1800000 * 12 }],
  },
  {
    fullName: 'Phạm Thị D', email: 'user4@taxvn.com', password: 'User@123',
    taxCode: '0123456784', idNumber: '001234567894', phone: '0912345674',
    address: '12 Đường Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
    dependents: 1,
    incomes: [{ source: 'salary', description: 'Lương tháng', amount: 22000000 * 12 }],
    extraDeductions: [{ type: 'charity', description: 'Từ thiện', amount: 2000000 }],
  },
  {
    fullName: 'Hoàng Văn E', email: 'user5@taxvn.com', password: 'User@123',
    taxCode: '0123456785', idNumber: '001234567895', phone: '0912345675',
    address: '90 Đường Cách Mạng Tháng 8, Phường 5, Quận 3, TP. Hồ Chí Minh',
    dependents: 0,
    incomes: [{ source: 'investment', description: 'Cổ tức, lãi đầu tư', amount: 80000000 }],
    extraDeductions: [],
  },
  {
    fullName: 'Vũ Thị F', email: 'user6@taxvn.com', password: 'User@123',
    taxCode: '0123456786', idNumber: '001234567896', phone: '0912345676',
    address: '33 Đường Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. Hồ Chí Minh',
    dependents: 2,
    incomes: [{ source: 'salary', description: 'Lương tháng', amount: 40000000 * 12 }],
    extraDeductions: [{ type: 'insurance', description: 'BHXH/BHYT/BHTN', amount: 2200000 * 12 }],
  },
  {
    fullName: 'Đặng Văn G', email: 'user7@taxvn.com', password: 'User@123',
    taxCode: '0123456787', idNumber: '001234567897', phone: '0912345677',
    address: '5 Đường Phan Xích Long, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh',
    dependents: 0,
    incomes: [{ source: 'salary', description: 'Lương tháng', amount: 15000000 * 12 }],
    extraDeductions: [],
  },
  {
    fullName: 'Bùi Thị H', email: 'user8@taxvn.com', password: 'User@123',
    taxCode: '0123456788', idNumber: '001234567898', phone: '0912345678',
    address: '67 Đường Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh',
    dependents: 1,
    incomes: [
      { source: 'salary', description: 'Lương tháng', amount: 28000000 * 12 },
      { source: 'other', description: 'Thu nhập khác', amount: 10000000 },
    ],
    extraDeductions: [{ type: 'insurance', description: 'BHXH/BHYT/BHTN', amount: 1700000 * 12 }],
  },
  {
    fullName: 'Đỗ Văn I', email: 'user9@taxvn.com', password: 'User@123',
    taxCode: '0123456789', idNumber: '001234567899', phone: '0912345679',
    address: '21 Đường Lý Thường Kiệt, Phường 7, Quận 10, TP. Hồ Chí Minh',
    dependents: 3,
    incomes: [{ source: 'salary', description: 'Lương tháng', amount: 35000000 * 12 }],
    extraDeductions: [{ type: 'insurance', description: 'BHXH/BHYT/BHTN', amount: 2000000 * 12 }],
  },
  {
    fullName: 'Ngô Thị K', email: 'user10@taxvn.com', password: 'User@123',
    taxCode: '0123456790', idNumber: '001234567900', phone: '0912345680',
    address: '88 Đường Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh',
    dependents: 0,
    incomes: [{ source: 'business', description: 'Kinh doanh tự do', amount: 120000000 }],
    extraDeductions: [],
  },
];

// Tính thuế lũy tiến theo bảng biểu (taxBrackets: [{ min, max, rate }])
const calculateProgressiveTax = (taxableIncome, taxBrackets) => {
  let remaining = taxableIncome;
  let taxAmount = 0;
  const breakdown = [];

  for (const bracket of taxBrackets) {
    if (remaining <= 0) break;
    const bracketSpan = (bracket.max != null ? bracket.max : Infinity) - bracket.min;
    const amountInBracket = Math.min(remaining, bracketSpan);
    if (amountInBracket <= 0) continue;
    const taxOnBracket = Math.round(amountInBracket * (bracket.rate / 100));
    taxAmount += taxOnBracket;
    breakdown.push({ rate: bracket.rate, amount: amountInBracket, taxOnBracket });
    remaining -= amountInBracket;
  }

  return { taxAmount, breakdown };
};

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tax_system');
  console.log('Đã kết nối MongoDB');

  // 1. Admin
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

  // 2. Cấu hình thuế (cần có trước để tính tờ khai)
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
  const taxConfig = await TaxConfig.findOne({ year: SEED_YEAR });
  if (!taxConfig) throw new Error(`Không tìm thấy TaxConfig cho năm ${SEED_YEAR}`);

  // 3. 10 user + hồ sơ thuế + thanh toán đi kèm
  let createdUsers = 0, skippedUsers = 0;
  let createdDeclarations = 0, skippedDeclarations = 0;
  let createdPayments = 0;

  for (let i = 0; i < sampleUsers.length; i++) {
    const { incomes, extraDeductions, dependents, ...userFields } = sampleUsers[i];

    let user = await User.findOne({ email: userFields.email });
    if (!user) {
      user = await User.create(userFields);
      console.log(`Đã tạo user: ${userFields.email} / ${userFields.password}`);
      createdUsers++;
    } else {
      skippedUsers++;
    }

    // Bỏ qua nếu user này đã có tờ khai năm SEED_YEAR
    const existingDeclaration = await TaxDeclaration.findOne({
      user: user._id, year: SEED_YEAR, declarationType: 'annual',
    });
    if (existingDeclaration) {
      skippedDeclarations++;
      continue;
    }

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    const deductions = [
      { type: 'personal', description: 'Giảm trừ bản thân', amount: taxConfig.personalDeduction * 12 },
    ];
    if (dependents > 0) {
      deductions.push({
        type: 'dependent',
        description: `Giảm trừ ${dependents} người phụ thuộc`,
        amount: taxConfig.dependentDeduction * 12 * dependents,
        dependents,
      });
    }
    deductions.push(...extraDeductions);

    const totalDeduction = deductions.reduce((sum, d) => sum + d.amount, 0);
    const taxableIncome = Math.max(totalIncome - totalDeduction, 0);
    const { taxAmount, breakdown } = calculateProgressiveTax(taxableIncome, taxConfig.taxBrackets);

    // Xen kẽ trạng thái để dữ liệu mẫu đa dạng: paid, submitted, pending
    const statusCycle = ['paid', 'submitted', 'pending'];
    const status = statusCycle[i % statusCycle.length];

    const declaration = await TaxDeclaration.create({
      user: user._id,
      year: SEED_YEAR,
      declarationType: 'annual',
      incomes,
      totalIncome,
      deductions,
      totalDeduction,
      taxableIncome,
      taxAmount,
      taxBrackets: breakdown,
      status,
      submittedAt: status !== 'pending' ? new Date(`${SEED_YEAR}-03-15`) : undefined,
      paidAt: status === 'paid' ? new Date(`${SEED_YEAR}-03-20`) : undefined,
      paymentMethod: status === 'paid' ? 'online' : undefined,
      dueDate: new Date(`${SEED_YEAR + 1}-03-31`),
      notes: 'Dữ liệu mẫu (seed)',
    });
    createdDeclarations++;

    // Tạo Payment nếu tờ khai đã 'paid'
    if (status === 'paid') {
      await Payment.create({
        user: user._id,
        declaration: declaration._id,
        amount: taxAmount,
        method: 'online',
        transactionId: `SEED-TXN-${userFields.email.split('@')[0]}-${SEED_YEAR}`,
        status: 'completed',
        paidAt: new Date(`${SEED_YEAR}-03-20`),
        note: 'Thanh toán mẫu (seed)',
      });
      createdPayments++;
    }
  }

  console.log(`\nUsers — tạo mới: ${createdUsers}, bỏ qua: ${skippedUsers}`);
  console.log(`Tax declarations — tạo mới: ${createdDeclarations}, bỏ qua: ${skippedDeclarations}`);
  console.log(`Payments — tạo mới: ${createdPayments}`);
  console.log('✅ Seed dữ liệu hoàn thành!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });