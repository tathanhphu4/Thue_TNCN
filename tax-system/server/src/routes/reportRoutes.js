const router  = require('express').Router();
const { getSystemSummary, getUserReport, exportPDF, exportExcel } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/summary', adminOnly, getSystemSummary);
router.get('/user',    getUserReport);
router.get('/export/pdf/:id', exportPDF);
router.get('/export/excel', adminOnly, exportExcel);

module.exports = router;
