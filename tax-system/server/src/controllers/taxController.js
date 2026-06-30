const TaxDeclaration = require('../models/TaxDeclaration');
const { calculateTax, calculateTaxableIncome } = require('../utils/taxCalculator');
const { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');
const TaxConfig = require('../models/TaxConfig');
const { handleControllerError } = require('../utils/errorHelpers');

// POST /api/tax/calculate  (tính thuế không lưu)
exports.calculate = async (req, res) => {
  try {
    const { totalIncome, dependents = 0, otherDeductions = 0, year = 2024 } = req.body;

    if (totalIncome == null || typeof totalIncome !== 'number' || totalIncome < 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tổng thu nhập hợp lệ (số không âm).' });
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
    handleControllerError(res, err, 'Lỗi tính thuế. Vui lòng thử lại.');
  }
};


// POST /api/tax/declare  (lưu khai báo)
exports.declare = async (req, res) => {
  try {
    const { year, month, declarationType, incomes, deductions } = req.body;

    if (!year || !declarationType) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp năm và loại khai báo.' });
    }
    if (!Array.isArray(incomes) || incomes.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp ít nhất một nguồn thu nhập.' });
    }
    if (!Array.isArray(deductions)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu giảm trừ không hợp lệ.' });
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
    handleControllerError(res, err, 'Lỗi lưu khai báo. Vui lòng thử lại.');
  }
};

// GET /api/tax/declarations
exports.getDeclarations = async (req, res) => {
  try {
    const declarations = await TaxDeclaration.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: declarations });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi lấy danh sách khai báo.');
  }
};

// GET /api/tax/declarations/:id
exports.getDeclaration = async (req, res) => {
  try {
    const declaration = await TaxDeclaration.findOne({ _id: req.params.id, user: req.user._id });
    if (!declaration) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: declaration });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi lấy chi tiết khai báo.');
  }
};
// POST /api/tax/declarations/:id/pay
exports.payDeclaration = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn phương thức thanh toán.' });
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
    handleControllerError(res, err, 'Lỗi nộp thuế. Vui lòng thử lại.');
  }
};

// GET /api/tax/admin/declarations (admin: lấy tất cả tờ khai)
exports.getAllDeclarations = async (req, res) => {
  try {
    const declarations = await TaxDeclaration.find().populate('user').sort({ createdAt: -1 });
    res.json({ success: true, data: declarations });
  } catch (err) {
    handleControllerError(res, err, 'Lỗi lấy tất cả tờ khai.');
  }
};