const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
//const checkVerifiedLandlord=require("../middleware/verification");
//const isVerifier=require("../middleware/verifier")

// GET aLL /listings
router.get('/', listingController.getAllListings);

//Get single listing
router.get('/:id', listingController.getListingById);

// Protected: Create new listing
//router.post('/', protect, checkVerifiedLandlord,listingController.createListing);
//For tenants to create regular listings (no middleware needed)
router.post('/', protect, listingController.createListing);

//Update a  listing by ID
router.put('/:id', protect, listingController.updateListing);
//Deleting a listing by ID
router.delete('/:id', protect, listingController.deleteListing);

module.exports = router;
