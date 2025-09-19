const mongoose = require('mongoose');

const CounselSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: JSON, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  related: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Counsel' }] },
  visits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Counsel', CounselSchema); 