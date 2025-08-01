const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
  Building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  // content: {
  //   type: String,
  //   required: true
  // },
  posts: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: true },
    content: { type: String, required: true },
    isComplaint: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },}]

},{timestamps:true});

module.exports = mongoose.model('ForumPost', ForumPostSchema);
