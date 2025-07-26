const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  longDesc: { type: JSON, required: true },
  thumbnail: { type: String, required: true }, // URL to the thumbnail image
  content: { type: String, required: true }, // URL to the video
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  related: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }] },
  visits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Video', VideoSchema);