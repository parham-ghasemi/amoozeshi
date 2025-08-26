const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 minutes in seconds
  }
});


// Modified User Schema
const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userName: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  favoriteCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  joinedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  favoriteVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }],
  favoriteArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article"
  }],
  favoritePodcasts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Podcast"
  }],
});

const User = mongoose.model('User', UserSchema);
const OTP = mongoose.model('OTP', OTPSchema);

module.exports = { User, OTP };
