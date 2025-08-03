const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect} = require('../middleware/authMiddleware');

//Get all forum posts (admin or general display) for a Building
router.get('/building/:buildingId', protect, forumController.getAllForums); // admin only

// Get all posts related to a specific building
router.get('/posts/:postId', forumController.getPosts);

//Creating a new forum post for a new building
router.post('posts/:buildingId', protect, forumController.createPost);

//Delete a specific post by ID (only by post owner)
router.delete('/posts/:postId', protect, forumController.deletePost);

module.exports = router; 