const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, trim: true, default: '' },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  coverImagePublicId: { type: String },
  author: { type: String, trim: true, default: 'Bottle Route' },
  metaTitle: { type: String, trim: true, default: '' },
  metaDescription: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
