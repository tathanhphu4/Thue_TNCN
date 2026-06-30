const mongoose = require('mongoose');
const TaxDeclaration = require('../models/TaxDeclaration');
const { calculateTax, calculateTaxableIncome } = require('../utils/taxCalculator');
const { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

const TaxConfig = require('../models/TaxConfig');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/tax/calculate  (tính thuế không lưu)
exports.calculate = async (req, res) => {
  try {
    const { totalIncome, dependents = 0, otherDeductions = 0, year = 2024 } = req.body;

    if (typeof totalIncome !== 'number' || totalIncome < 0) {
      return res.status(400).json({ success: false, message: 'Tổng thu nhập phải là số không âm.' });
    }
    if (typeof dependents !== 'number' || dependents < 0 || !Number.isInteger(dependents)) {
      return res.status(400).json({ success: false, message: 'Số người phụ thuộc không hợp lệ.' });
    }
    if (typeof otherDeductions !== 'number' || otherDeductions < 0) {
      return res.status(400).json({ success: false, message: 'Khoản giảm trừ khác phải là số không âm.' });
    }
    
    let personalDeduction = PERSONAL_DEDUCTION;
    let dependentDeduction = DEPENDENT_DEDUCTION;
    let taxBrackets = null;

    const config = await TaxConfig.findOne({ year: parseInt(year), isActive: true });
    if (config) {
      personalDeduction = config.personalDeduction;
      dependentDeduction = config.dependentDeduction;
      taxBrackets = config.taxBrackets;
    }

    const taxableIncome = calculateTaxableIncome({
      totalIncome, personalDeduction,
      dependents, dependentDeduction, otherDeductions
    });
    const { totalTax, brackets } = calculateTax(taxableIncome, taxBrackets);
    res.json({ success: true, data: { totalIncome, taxableIncome, totalTax, brackets } });
  } catch (err) {
    console.error('calculate error:', err);
    res.status(500).json({ success: false, message: 'Lỗi tính thuế. Vui lòng thử lại.' });
  }
};


// POST /api/tax/declare  (lưu khai báo)
exports.declare = async (req, res) => {
  try {
    const { year, month, declarationType, incomes, deductions } = req.body;

    if (!year || !declarationType) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập năm và loại khai báo.' });
    }
    if (!Array.isArray(incomes) || incomes.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập ít nhất một nguồn thu nhập.' });
    }
    if (!Array.isArray(deductions)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu giảm trừ không hợp lệ.' });
    }
    for (const inc of incomes) {
      if (typeof inc.amount !== 'number' || inc.amount < 0) {
        return res.status(400).json({ success: false, message: 'Số tiền thu nhập phải là số không âm.' });
      }
    }

    const totalIncome    = incomes.reduce((s, i) => s + i.amount, 0);
    const dependents     = deductions.find(d => d.type === 'dependent')?.dependents || 0;
    const otherDeductions = deductions.filter(d => d.type !== 'dependent').reduce((s, d) => s + d.amount, 0);

    let personalDeduction = PERSONAL_DEDUCTION;
    let dependentDeduction = DEPENDENT_DEDUCTION;
    let taxBrackets = null;

    const config = await TaxConfig.findOne({ year: parseInt(year), isActive: true });
    if (config) {
      personalDeduction = config.personalDeduction;
      dependentDeduction = config.dependentDeduction;
      taxBrackets = config.taxBrackets;
    }

    const taxableIncome = calculateTaxableIncome({
      totalIncome, personalDeduction,
      dependents, dependentDeduction, otherDeductions
    });
    const { totalTax, brackets } = calculateTax(taxableIncome, taxBrackets);

    const totalDeduction = personalDeduction + dependents * dependentDeduction + otherDeductions;

    const declaration = await TaxDeclaration.create({
      user: req.user._id, year, month, declarationType,
      incomes, deductions, totalIncome, totalDeduction,
      taxableIncome, taxAmount: totalTax, taxBrackets: brackets,
      status: 'pending', submittedAt: new Date(),
    });

    res.status(201).json({ success: true, data: declaration });
  } catch (err) {
    console.error('declare error:', err);
    res.status(500).json({ success: false, message: 'Lỗi khai báo thuế. Vui lòng thử lại.' });
  }
};

// GET /api/tax/declarations
exports.getDeclarations = async (req, res) => {
  try {
    const declarations = await TaxDeclaration.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: declarations });
  } catch (err) {
    console.error('getDeclarations error:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tờ khai.' });
  }
};

// GET /api/tax/declarations/:id
exports.getDeclaration = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
    }
    const declaration = await TaxDeclaration.findOne({ _id: req.params.id, user: req.user._id });
    if (!declaration) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: declaration });
  } catch (err) {
    console.error('getDeclaration error:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết tờ khai.' });
  }
};
// POST /api/tax/declarations/:id/pay
exports.payDeclaration = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ.' });
    }

    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn phương thức thanh toán.' });
    }

    const allowedMethods = ['bank_transfer', 'online', 'cash', 'momo'];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Phương thức thanh toán không hợp lệ.' });
    }

    const declaration = await TaxDeclaration.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!declaration) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khai báo.' });
    }

    if (declaration.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Khai báo này đã được nộp thuế.' });
    }

    if (!['pending', 'submitted', 'overdue'].includes(declaration.status)) {
      return res.status(400).json({ success: false, message: 'Khai báo không ở trạng thái có thể nộp thuế.' });
    }

    declaration.status = 'paid';
    declaration.paidAt = new Date();
    declaration.paymentMethod = paymentMethod;
    await declaration.save();

    res.json({ success: true, data: declaration });
  } catch (err) {
    console.error('payDeclaration error:', err);
    res.status(500).json({ success: false, message: 'Lỗi thanh toán. Vui lòng thử lại.' });
  }
};

// GET /api/tax/admin/declarations (admin: lấy tất cả tờ khai)
exports.getAllDeclarations = async (req, res) => {
  try {
    const declarations = await TaxDeclaration.find().populate('user').sort({ createdAt: -1 });
    res.json({ success: true, data: declarations });
  } catch (err) {
    console.error('getAllDeclarations error:', err);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tờ khai.' });
  }
};
