const router = require('express').Router();
const { getAllUsers, updateProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/',        adminOnly, getAllUsers);
router.put('/profile', updateProfile);

module.exports = router;
