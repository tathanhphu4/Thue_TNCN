const router  = require('express').Router();
const { getSystemSummary, getUserReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/summary', adminOnly, getSystemSummary);
router.get('/user',    getUserReport);

module.exports = router;
