const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true },
  shortDesc: { type: String, required: true },
  thumbnail: { type: String, required: true }, // URL to the thumbnail video
  longDesc: { type: JSON, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  time: { type: Number, required: true }, // in hours
  level: { type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  goal: { type: String, required: true },
  topics: { type: [{ head: String, body: String }], required: true },
  questions: { type: [{ question: String, answer: String }], required: true },
  content: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'content.itemType' // 👈 dynamic reference
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Video', 'Article']
    }
  }],
  related: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  joinedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', CourseSchema);
