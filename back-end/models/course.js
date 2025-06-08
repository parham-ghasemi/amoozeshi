const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  thumbnail: { type: String, required: true }, // URL to the thumbnail vidoe
  longDesc: { type: String, required: true },
  category: { type: String, required: true, enum: ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'Game development'] },
  time: { type: Number, required: true }, // in minutes
  level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  goal: { type: String, required: true },
  topics: { type: [{ head: String, body: String }], required: true },
  questions: { type: [{ question: String, answer: String }], required: true },
  content: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, required: true, enum: ['video', 'article', 'quiz'] }
  }],
  related: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Course', CourseSchema);