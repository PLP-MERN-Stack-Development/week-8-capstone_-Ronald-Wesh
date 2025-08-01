const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect} = require('../middleware/authMiddleware');

//Get all forum posts (admin or general display)
router.get('/all', protect, forumController.getAllForums); // admin only

// Get all posts related to a specific building
router.get('/:buildingId', forumController.getPosts);

//Creating a new forum post for a new building
router.post('/:buildingId', protect, forumController.createPost);

//Delete a specific post by ID (only by post owner)
router.delete('/:postId', protect, forumController.deletePost);

module.exports = router; 