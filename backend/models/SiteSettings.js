const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Bottle Route' },
  tagline: { type: String, default: 'Drinks Delivered. Good Times Guaranteed.' },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  deliveryTime: { type: String, default: '30 Minutes' },
  minAge: { type: Number, default: 19 },
  socialLinks: {
    instagram: String,
    facebook: String,
    twitter: String,
    tiktok: String,
  },
  logo: { type: String },
  logoPublicId: { type: String },
  deliveryZones: [{ type: String }],
  operatingHours: {
    open: { type: String, default: '10:00 AM' },
    close: { type: String, default: '3:00 AM' },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
