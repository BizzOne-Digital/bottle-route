const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['vodka', 'whisky', 'tequila', 'rum', 'brandy', 'beer', 'cooler', 'convenience', 'other'],
  },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  volume: { type: String, default: '750ml' },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  regularsFavourite: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
