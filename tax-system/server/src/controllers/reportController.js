const TaxDeclaration = require('../models/TaxDeclaration');
const User = require('../models/User');

// GET /api/reports/summary  (admin: tổng quan hệ thống)
exports.getSystemSummary = async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments({ role: 'user' });
    const totalDeclarations = await TaxDeclaration.countDocuments();
    const totalTaxCollected = await TaxDeclaration.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$taxAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDeclarations,
        totalTaxCollected: totalTaxCollected[0]?.total || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reports/user  (user: báo cáo cá nhân)
exports.getUserReport = async (req, res) => {
  try {
    const { year } = req.query;
    const query = { user: req.user._id };
    if (year) query.year = parseInt(year);

    const declarations = await TaxDeclaration.find(query).sort({ year: -1, month: -1 });
    const totalTax = declarations.reduce((s, d) => s + d.taxAmount, 0);

    res.json({ success: true, data: { declarations, totalTax } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
