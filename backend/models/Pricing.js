const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, default: '' },
  desc: { type: String, default: '' },
  features: [{ type: String }],
  cta: { type: String, default: 'Order Now' },
  href: { type: String, default: '/shop' },
  highlight: { type: Boolean, default: false },
}, { _id: false });

const feeSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  fee: { type: String, required: true },
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  plans: [planSchema],
  deliveryFees: [feeSchema],
  note: {
    type: String,
    default: 'All prices shown exclude applicable taxes. Minimum order value may apply. Product prices visible in the shop.',
  },
}, { timestamps: true });

module.exports = mongoose.model('Pricing', pricingSchema);
