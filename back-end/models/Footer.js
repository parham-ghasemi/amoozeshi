const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'اطلاعیه مدیریت'
  },
  description: {
    type: String,
    required: true,
    default: 'محتوای سفارشی از سوی مدیریت به زودی اضافه خواهد شد.'
  }
}, { timestamps: true });

module.exports = mongoose.model('Footer', footerSchema);