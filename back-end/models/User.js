const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userName: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true, unique: true},
  hashedPassword: { type: String, required: true },
  role: {type: String, required: true, enum:['admin', 'user'], default: 'user'}
})

module.exports = mongoose.model('User', UserSchema);