const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
// const {
//   register,
//   login,
//   getUserProfile,
//   updateUserProfile,
//   getMe
// } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Uncomment when middleware is ready

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get user profile (protected)
router.get('/profile', protect, authController.getUserProfile);

// Update user profile (protected)
router.put('/profile', protect, authController.updateUserProfile);

// router.get('/test', (req, res) => {
//     res.send('Auth route is working!');
//   });
  
router.get('/me', protect,authController.getMe);
module.exports = router; 