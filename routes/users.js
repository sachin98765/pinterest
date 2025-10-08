const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb+srv://sm3938722_db_user:sRbTn44t8Pgz4n2Q@cluster0.qlj3xnq.mongodb.net/');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  dp: { type: String }, // URL or path to display picture
  email: { type: String, required: true, unique: true },
  fullname: { type: String, required: true }
});

userSchema.plugin(plm); 

module.exports = mongoose.model('User', userSchema);