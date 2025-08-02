const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  post: [{
    user: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: true },
    content: { type: String, required: true },
    //isComplaint: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },}]

},{timestamps:true});

module.exports = mongoose.model('ForumPost', ForumPostSchema);
