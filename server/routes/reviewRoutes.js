const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get all reviews for a listing
router.get('/', reviewController.getReviews);

// Get reviews for a specific building
router.get('/building/:buildingId', reviewController.getReviews);

// Create a review for a specific building (requires login)
router.post('building/:buildingId', protect, reviewController.createReview);


// Get all reviews by a specific user
router.get('/user/:userId', reviewController.getUserReviews);


// Private: Update a review (logged in + review owner OR admin)
//router.put('/:reviewId', protect, updateReview);


// Delete a review (protected)
router.delete('/:reviewId', protect, reviewController.deleteReview);

module.exports = router; 