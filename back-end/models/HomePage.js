const mongoose = require('mongoose');

const homePageSchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    required: true,
    default: 'یادگیری، الهام و رشد در یک مکان'
  },
  heroDescription: {
    type: String,
    required: true,
    default: 'در این وب‌سایت می‌توانید به مجموعه‌ای از مقالات تخصصی، ویدئوهای آموزشی، پادکست‌های الهام‌بخش و دوره‌های کاربردی دسترسی پیدا کنید. هدف ما کمک به ارتقای مهارت‌ها و توسعه فردی شماست.'
  },
  middleText: {
    type: String,
    required: true,
    default: 'ما فضایی فراهم کرده‌ایم تا بتوانید از محتوای آموزشی باکیفیت در قالب‌های مختلف بهره‌مند شوید. از تازه‌ترین مقالات گرفته تا دوره‌های تخصصی، همه در خدمت رشد و یادگیری شماست.'
  },
  sectionTitle: {
    type: String,
    required: true,
    default: 'مسیر یادگیری خود را آغاز کنید'
  },
  sectionDescription: {
    type: String,
    required: true,
    default: 'با دوره‌های آموزشی متنوع، پادکست‌های انگیزشی و مقالات تخصصی، هر روز گامی به سمت پیشرفت و موفقیت بردارید.'
  },
  footerTitle: {
    type: String,
    required: true,
    default: 'همراه شما در مسیر یادگیری'
  },
  footerDescription: {
    type: String,
    required: true,
    default: 'با محتوای آموزشی متنوع و به‌روز، مهارت‌های خود را ارتقا دهید و آینده‌ای بهتر بسازید.'
  },
  mosaicImages1: {
    type: [String],
    default: []
  },
  mosaicImages2: {
    type: [String],
    default: []
  },
  sectionImage: {
    type: String,
    default: ''
  },
  statsCards: {
    type: [{
      title: { type: String, required: true },
      content: { type: String, required: true }
    }],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('HomePage', homePageSchema);