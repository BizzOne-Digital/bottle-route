const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, premium, regularsFavourite, inStock } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (premium === 'true') filter.premium = true;
    if (regularsFavourite === 'true') filter.regularsFavourite = true;
    if (inStock === 'true') filter.inStock = true;

    const products = await Product.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const product = await Product.create({
      ...req.body,
      image: req.file.path,
      imagePublicId: req.file.filename,
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const updateData = { ...req.body };
    if (req.file) {
      if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId);
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId);
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
