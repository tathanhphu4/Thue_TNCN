const router = require('express').Router();
const { getAllUsers, updateProfile, changePassword } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/',        adminOnly, getAllUsers);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
