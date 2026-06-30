const router = require('express').Router();
const { calculate, declare, getDeclarations, getDeclaration, payDeclaration, getAllDeclarations } = require('../controllers/taxController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.post('/calculate',           calculate);
router.post('/declare',             declare);
router.get('/declarations',         getDeclarations);
router.get('/admin/declarations',   adminOnly, getAllDeclarations);
router.get('/declarations/:id',     getDeclaration);
router.post('/declarations/:id/pay', payDeclaration);

module.exports = router;