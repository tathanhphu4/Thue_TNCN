const TaxDeclaration = require('../models/TaxDeclaration');
const { calculateTax, calculateTaxableIncome } = require('../utils/taxCalculator');
const { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

const TaxConfig = require('../models/TaxConfig');

exports.calculate = async (req, res) => {
  try {
    const { totalIncome, dependents = 0, otherDeductions = 0, year = 2024 } = req.body;
    
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
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.declare = async (req, res) => {
  try {
    const { year, month, declarationType, incomes, deductions } = req.body;

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
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeclarations = async (req, res) => {
  try {
    const declarations = await TaxDeclaration.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: declarations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDeclaration = async (req, res) => {
  try {
    const declaration = await TaxDeclaration.findOne({ _id: req.params.id, user: req.user._id });
    if (!declaration) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    res.json({ success: true, data: declaration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
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
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDeclarations = async (req, res) => {
  try {
    const declarations = await TaxDeclaration.find().populate('user').sort({ createdAt: -1 });
    res.json({ success: true, data: declarations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};