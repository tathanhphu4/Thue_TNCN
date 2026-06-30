const router = require('express').Router();
const { calculate, declare, getDeclarations, getDeclaration, payDeclaration } = require('../controllers/taxController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/calculate',           calculate);
router.post('/declare',             declare);
router.get('/declarations',         getDeclarations);
router.get('/declarations/:id',     getDeclaration);
router.post('/declarations/:id/pay', payDeclaration);  // ← thêm dòng này

module.exports = router;