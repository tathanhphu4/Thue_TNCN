const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const TaxConfig = require('../models/TaxConfig');
const { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');

router.get('/tax-rules', protect, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2024;
    const config = await TaxConfig.findOne({ year, isActive: true });
    
    if (!config) {
      return res.json({
        success: true,
        data: {
          year,
          TAX_BRACKETS,
          PERSONAL_DEDUCTION,
          DEPENDENT_DEDUCTION
        }
      });
    }

    res.json({
      success: true,
      data: {
        year: config.year,
        TAX_BRACKETS: config.taxBrackets.map(b => ({ min: b.min, max: b.max, rate: b.rate })),
        PERSONAL_DEDUCTION: config.personalDeduction,
        DEPENDENT_DEDUCTION: config.dependentDeduction
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/tax-rules', protect, adminOnly, async (req, res) => {
  try {
    const { year = 2024, TAX_BRACKETS: inputBrackets, PERSONAL_DEDUCTION: personal, DEPENDENT_DEDUCTION: dependent } = req.body;
    
    if (!personal || !dependent || !inputBrackets || !Array.isArray(inputBrackets)) {
      return res.status(400).json({ success: false, message: 'Thiếu dữ liệu cấu hình hoặc định dạng không đúng.' });
    }

    let config = await TaxConfig.findOne({ year });
    if (!config) {
      config = new TaxConfig({ year });
    }

    config.personalDeduction = personal;
    config.dependentDeduction = dependent;
    config.taxBrackets = inputBrackets;
    config.isActive = true;

    await config.save();

    res.json({
      success: true,
      message: `Cập nhật biểu thuế năm ${year} thành công!`,
      data: {
        year: config.year,
        TAX_BRACKETS: config.taxBrackets.map(b => ({ min: b.min, max: b.max, rate: b.rate })),
        PERSONAL_DEDUCTION: config.personalDeduction,
        DEPENDENT_DEDUCTION: config.dependentDeduction
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
