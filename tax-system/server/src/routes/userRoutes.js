const router = require('express').Router();
const { getAllUsers, updateProfile, changePassword, toggleUserStatus } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/',        adminOnly, getAllUsers);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.put('/:id/toggle-status', adminOnly, toggleUserStatus);

module.exports = router;
