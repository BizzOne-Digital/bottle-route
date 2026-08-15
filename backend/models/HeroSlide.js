const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  subheadline: { type: String },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  ctaText: { type: String, default: 'Order Now' },
  ctaLink: { type: String, default: '#order' },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
