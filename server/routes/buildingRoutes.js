// routes/buildingRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Uncomment when middleware is ready
  // Authentication middleware
const buildingController = require('../controllers/buildingController');

// Admin protected routes (creating/editing buildings)
router.post('/', protect,  buildingController.createBuilding); // Admins can create new buildings

// Get a single building by ID
router.get('/:buildingId', buildingController.getBuildingById);

// Get all buildings (for listing purposes)
router.get('/', buildingController.getAllBuildings);

// Optional: Update a building (protected)
router.put('/:buildingId', protect, buildingController.updateBuilding);

// Optional: Delete a building (protected)
router.delete('/:buildingId', protect,  buildingController.deleteBuilding);

module.exports = router;
