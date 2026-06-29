const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');

// Placeholder - sẽ implement sau
router.get('/tax-rules', protect, (req, res) => {
  const { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } = require('../config/taxRules');
  res.json({ success: true, data: { TAX_BRACKETS, PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION } });
});

module.exports = router;
