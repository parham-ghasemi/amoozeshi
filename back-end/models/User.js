const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userName: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true, unique: true},
  hashedPassword: { type: String, required: true },
})

module.exports = mongoose.model('Admin', AdminSchema);