const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  building: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Building', 
    required: true },
   reviewer: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: true },
     ratings: {
      safety: { type: Number, min: 1, max: 5 },
      water: { type: Number, min: 1, max: 5 },
      landlord: { type: Number, min: 1, max: 5 }
    },
    isAnonymous:{type:Boolean,default:true},
    comment: String
},{timestamps:true});

module.exports = mongoose.model('Review', ReviewSchema);
