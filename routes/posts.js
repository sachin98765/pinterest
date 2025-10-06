const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: { type: String, required: true },
  image: String,
  user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Array, default: [] }
});

module.exports = mongoose.model('Post', postSchema);