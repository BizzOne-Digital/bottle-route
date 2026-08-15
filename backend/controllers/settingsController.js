const SiteSettings = require('../models/SiteSettings');
const { cloudinary } = require('../config/cloudinary');

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    const updateData = { ...req.body };
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      updateData.socialLinks = JSON.parse(req.body.socialLinks);
    }
    if (req.body.operatingHours && typeof req.body.operatingHours === 'string') {
      updateData.operatingHours = JSON.parse(req.body.operatingHours);
    }

    if (req.file) {
      if (settings.logoPublicId) await cloudinary.uploader.destroy(settings.logoPublicId);
      updateData.logo = req.file.path;
      updateData.logoPublicId = req.file.filename;
    }

    Object.assign(settings, updateData);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
