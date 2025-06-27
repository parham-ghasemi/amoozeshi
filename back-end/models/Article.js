const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: JSON, required: true },
  category: { type: String, required: true, enum: ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'Game development'] },
  related: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }] },
  visits: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Article', ArticleSchema);