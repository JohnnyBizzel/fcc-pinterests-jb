const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  twitterId: String,
  facebookId: String,
  githubId: String,
  displayName: String,
  credits: { type: Number, default: 0 } // specific to udemy Course
});

mongoose.model('users', userSchema);
