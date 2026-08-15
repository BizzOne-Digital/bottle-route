const Pricing = require('../models/Pricing');

exports.getPricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    if (!pricing) pricing = await Pricing.create({});
    res.json({ success: true, data: pricing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json({ success: true, data: pricing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
