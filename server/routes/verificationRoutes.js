//Used by admin/verifier to view requests & verify landlords
const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { protect} = require('../middleware/authMiddleware');
const verifier=require("../middleware/verifier")

// router.get('/pending', protect,  verificationController.getPendingVerifications);
// router.post('/:id/approve', protect,  verificationController.approveVerification);
// router.post('/:id/reject', protect, verificationController.rejectVerification);

// Route: Submit verification (Admin verifies a user)
router.put("/:id",protect,verifier,verificationController.submitVerification);

// Route: Get all verification requests (Only admins can view)
router.get("/",protect,verifier,verificationController.getAllRequests);

module.exports = router;